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

  test('running a search renders results linking back to /entry/:family/:uniprot using rawData', async () => {
    useSearchStore.setState({
      data: [{ label: 'Avenolide (AvaR1/TetR)', link: '/entry/TetR/Q82H41' }],
      rawData: {
        Q82H41: {
          uniprot: 'Q82H41',
          alias: 'AvaR1',
          family: 'TetR',
          ligands: ['Avenolide'],
        },
      },
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            results: [
              {
                sensorId: 'Q82H41',
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
    expect(screen.getByText('Uniprot ID: Q82H41')).toBeInTheDocument();
    expect(screen.getByText('Similarity Score: 87%')).toBeInTheDocument();

    const resultLink = screen.getByText('Avenolide').closest('a');
    expect(resultLink).toHaveAttribute('href', '/entry/TetR/Q82H41');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.groov.bio/ligandSearch',
      expect.objectContaining({ method: 'POST' })
    );
  });

  test('shows a "no matching results" message when the API returns an empty result set', async () => {
    useSearchStore.setState({
      data: [{ label: 'Avenolide (AvaR1/TetR)', link: '/entry/TetR/Q82H41' }],
      rawData: {
        Q82H41: { uniprot: 'Q82H41', alias: 'AvaR1', family: 'TetR' },
      },
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
