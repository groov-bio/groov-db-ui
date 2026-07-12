import React from 'react';
import { renderWithProviders, screen } from '../../test-utils';
import Tools from '../../Components/Tools';

describe('Tools', () => {
  test('renders the Tools heading', () => {
    renderWithProviders(<Tools />);
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  test('renders a card for each tool with title, description, and outbound link', () => {
    renderWithProviders(<Tools />);

    const snowprintTitle = screen.getByText('Snowprint');
    expect(snowprintTitle.closest('a')).toHaveAttribute(
      'href',
      'https://snowprint.groov.bio'
    );
    expect(
      screen.getByText(
        'Uses phylogenetic information to predict what DNA sequence an input transcription factor binds to.'
      )
    ).toBeInTheDocument();

    const ligifyTitle = screen.getByText('Ligify');
    expect(ligifyTitle.closest('a')).toHaveAttribute(
      'href',
      'https://ligify.groov.bio'
    );

    const sensBioTitle = screen.getByText('SensBio');
    expect(sensBioTitle.closest('a')).toHaveAttribute(
      'href',
      'https://jonathan-tellechea-sensbio-app-sensbio-f6bjn1.streamlit.app/'
    );

    const tfbMinerTitle = screen.getByText('TFBMiner');
    expect(tfbMinerTitle.closest('a')).toHaveAttribute(
      'href',
      'https://github.com/UoMMIB/TFBMiner'
    );
  });

  test('renders exactly 4 tool links', () => {
    renderWithProviders(<Tools />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
  });
});
