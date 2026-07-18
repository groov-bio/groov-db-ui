import React from 'react';
import { renderWithProviders, screen } from '../../test-utils';
import AdvancedSearch from '../../Components/AdvancedSearch';
import useSearchStore from '../../zustand/search.store.js';

describe('AdvancedSearch', () => {
  beforeEach(() => {
    useSearchStore.setState({
      stats: { regulators: 'Loading ...', ligands: 'Loading ...' },
      data: [],
      rawData: [],
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('disables the SMILES input and search controls until search-store data has loaded', () => {
    renderWithProviders(<AdvancedSearch />);

    expect(screen.getByLabelText('SMILES String')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Use Example SMILES' })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Search/i })).toBeDisabled();
  });

  test('running a search renders results linking to the V2 sensor page /sensor/:id', async () => {
    useSearchStore.setState({
      data: [{ label: 'GRV-T00001 — Avenolide (AvaR1/TetR)', link: '/sensor/GRV-T00001' }],
    });

    // The V2 API returns GRV sensor ids directly — no rawData join needed.
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                sensorId: 'GRV-T00001',
                ligandId: 'lig-1',
                name: 'Avenolide',
                similarity: 0.87,
              },
            ],
          }),
      })
    );

    const { user } = renderWithProviders(<AdvancedSearch />);

    const smilesInput = screen.getByLabelText('SMILES String');
    expect(smilesInput).toBeEnabled();
    await user.type(smilesInput, 'CC1CCC(=O)O1');
    await user.click(screen.getByRole('button', { name: /Search/i }));

    expect(await screen.findByText('Results (1)')).toBeInTheDocument();
    expect(screen.getByText('Avenolide')).toBeInTheDocument();
    expect(screen.getByText('Sensor ID: GRV-T00001')).toBeInTheDocument();
    expect(screen.getByText('Similarity Score: 87%')).toBeInTheDocument();

    const resultLink = screen.getByText('Avenolide').closest('a');
    expect(resultLink).toHaveAttribute('href', '/sensor/GRV-T00001');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/v2/ligandSearch'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('shows a "no matching results" message when the API returns an empty result set', async () => {
    useSearchStore.setState({
      data: [{ label: 'GRV-T00001 — Avenolide (AvaR1/TetR)', link: '/sensor/GRV-T00001' }],
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ results: [] }) })
    );

    const { user } = renderWithProviders(<AdvancedSearch />);

    await user.click(screen.getByRole('button', { name: 'Use Example SMILES' }));
    expect(screen.getByLabelText('SMILES String')).toHaveValue(
      'CC1=C(C(=CC(=C1)CCCC(C)C)O)C(C)'
    );

    await user.click(screen.getByRole('button', { name: /Search/i }));

    expect(
      await screen.findByText(
        'No matching results found. Try adjusting the threshold or using a different SMILES.'
      )
    ).toBeInTheDocument();
  });
});
