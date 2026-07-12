import React from 'react';
import { renderWithProviders, screen } from '../../../test-utils';
import MetadataTable from '../../../Components/Sensor_Components/MetadataTable';

describe('MetadataTable', () => {
  test('renders a label and plain value when no link is provided', () => {
    renderWithProviders(
      <MetadataTable
        tableData={{
          'Regulation Type': { name: 'Apo-repressor' },
        }}
      />
    );

    expect(screen.getByText('Regulation Type')).toBeInTheDocument();
    const value = screen.getByText('Apo-repressor');
    expect(value).toBeInTheDocument();
    expect(value).toHaveAttribute('id', 'metadata-table-Regulation Type');
    // No anchor wrapping the value when link is absent.
    expect(value.closest('a')).toBeNull();
  });

  test('wraps the value in a link to link.url when a link is provided', () => {
    renderWithProviders(
      <MetadataTable
        tableData={{
          'Uniprot ID': {
            name: 'Q82H41',
            link: { url: 'https://www.uniprot.org/uniprot/Q82H41' },
          },
        }}
      />
    );

    const value = screen.getByText('Q82H41');
    expect(value).toHaveAttribute('id', 'metadata-table-data-Uniprot ID');
    const anchor = value.closest('a');
    expect(anchor).toHaveAttribute(
      'href',
      'https://www.uniprot.org/uniprot/Q82H41'
    );
    expect(anchor).toHaveAttribute('target', '_blank');
  });

  test('renders multiple rows, each with their own label/value pair', () => {
    renderWithProviders(
      <MetadataTable
        tableData={{
          'RefSeq ID': {
            name: 'NP_823382.1',
            link: { url: 'https://www.ncbi.nlm.nih.gov/protein/NP_823382.1' },
          },
          'Protein Length': { name: 54 },
        }}
      />
    );

    expect(screen.getByText('RefSeq ID')).toBeInTheDocument();
    expect(screen.getByText('NP_823382.1')).toBeInTheDocument();
    expect(screen.getByText('Protein Length')).toBeInTheDocument();
    expect(screen.getByText('54')).toBeInTheDocument();
  });

  // Current (suspected quirk) behavior: when a KEGG ID link.url resolves to
  // the literal "...?null" (i.e. no keggID was ever set upstream), the
  // component special-cases it and renders the value as plain text instead
  // of a clickable link — even though the row's `name` may say "None". This
  // documents that current behavior rather than asserting it is desirable.
  test('does not wrap value in a link when link.url is the "?null" KEGG sentinel', () => {
    renderWithProviders(
      <MetadataTable
        tableData={{
          'KEGG ID': {
            name: 'None',
            link: { url: 'https://www.genome.jp/dbget-bin/www_bget?null' },
          },
        }}
      />
    );

    const value = screen.getByText('None');
    expect(value).toHaveAttribute('id', 'metadata-table-KEGG ID');
    expect(value.closest('a')).toBeNull();
  });
});
