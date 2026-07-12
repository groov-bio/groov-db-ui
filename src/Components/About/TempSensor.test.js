import { renderWithProviders, screen } from '../../test-utils';
import TempSensor from './TempSensor.js';

const baseData = {
  family: 'TetR',
  uniProtID: 'P0ACT4',
  about: {
    accession: 'NP_012345',
    alias: 'TetR repressor',
    mechanism: 'Allosteric repressor',
    about: 'A description of the sensor mechanism.',
  },
};

describe('TempSensor', () => {
  test('renders the sensor summary table with alias, family, mechanism, and description', () => {
    renderWithProviders(<TempSensor data={baseData} />);

    expect(screen.getByText('TetR repressor')).toBeInTheDocument();
    expect(screen.getByText('TetR')).toBeInTheDocument();
    expect(screen.getByText('Allosteric repressor')).toBeInTheDocument();
    expect(
      screen.getByText('A description of the sensor mechanism.')
    ).toBeInTheDocument();
  });

  test('links the UniprotID and NCBI accession to their respective external databases', () => {
    renderWithProviders(<TempSensor data={baseData} />);

    const uniprotLink = screen.getByText('P0ACT4');
    expect(uniprotLink).toHaveAttribute(
      'href',
      'https://www.uniprot.org/uniprot/P0ACT4'
    );

    const accessionLink = screen.getByText('NP_012345');
    expect(accessionLink).toHaveAttribute(
      'href',
      'https://www.ncbi.nlm.nih.gov/protein/NP_012345'
    );
  });

  test('shows fallback text when no ligands or operators are submitted', () => {
    renderWithProviders(<TempSensor data={baseData} />);
    expect(screen.getByText('No ligands submitted')).toBeInTheDocument();
    expect(screen.getByText('No operators submitted')).toBeInTheDocument();
  });

  test('shows "Not submitted" for an empty mechanism and a fallback description', () => {
    const data = {
      ...baseData,
      about: { ...baseData.about, mechanism: '', about: undefined },
    };
    renderWithProviders(<TempSensor data={data} />);
    expect(screen.getByText('Not submitted')).toBeInTheDocument();
    expect(screen.getByText('No description provided')).toBeInTheDocument();
  });
});
