import React from 'react';
import { renderWithProviders, screen } from '../../../test-utils';

// SensorPageV2View -> ProteinPanel -> DNAbinding transitively imports
// @mui/x-data-grid, whose hash util calls `new TextEncoder()` at module
// scope. jest-environment-jsdom does not provide a global TextEncoder, so we
// polyfill it before requiring the component. This must be a plain
// `require()` (not `import`) so Babel does not hoist it above this line the
// way it would with ES `import` syntax.
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const SensorPageV2View = require('../../../Components/Sensor_Components/SensorPageV2View').default;

const singleProteinSensor = {
  id: 'GRV-T00001',
  category: 'TetR',
  type: 'One Component',
  about: 'A TetR-family transcriptional regulator.',
  proteins: [
    {
      alias: 'AvaR1',
      uniprot_id: 'Q82H41',
      sequence: 'MSTNKELVDRILEAAEEVFAEKGYAAASMDDIAKAAGVGKGTIYLYFKDKQDLL',
      regulation_type: 'Apo-repressor',
    },
  ],
};

const dualProteinSensor = {
  id: 'GRV-D00002',
  category: 'Dual',
  type: 'Two Component',
  proteins: [
    { alias: 'SensorHK', uniprot_id: 'P11111' },
    { alias: 'ResponseRR', uniprot_id: 'P22222' },
  ],
};

describe('SensorPageV2View', () => {
  test('renders the sensor title, GRV id, category/type chips, and Edit Sensor button', () => {
    const onEdit = jest.fn();
    renderWithProviders(
      <SensorPageV2View sensor={singleProteinSensor} onEdit={onEdit} />
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'AvaR1' })
    ).toBeInTheDocument();
    expect(screen.getByText('GRV-T00001')).toBeInTheDocument();
    expect(screen.getByText('TetR')).toBeInTheDocument();
    expect(screen.getByText('One Component')).toBeInTheDocument();

    const editButton = screen.getByRole('button', { name: /Edit Sensor/i });
    editButton.click();
    expect(onEdit).toHaveBeenCalled();
  });

  test('hides the Edit Sensor button when hideEditButton is set', () => {
    renderWithProviders(
      <SensorPageV2View sensor={singleProteinSensor} hideEditButton />
    );
    expect(
      screen.queryByRole('button', { name: /Edit Sensor/i })
    ).not.toBeInTheDocument();
  });

  test('falls back to "<category> Sensor" as the title when no protein has an alias', () => {
    renderWithProviders(
      <SensorPageV2View sensor={{ category: 'GntR', proteins: [] }} hideEditButton />
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'GntR Sensor' })
    ).toBeInTheDocument();
  });

  test('renders a tab per protein for multi-protein (e.g. two-component) sensors', () => {
    renderWithProviders(
      <SensorPageV2View sensor={dualProteinSensor} hideEditButton />
    );

    // Title joins every protein alias with "/".
    expect(
      screen.getByRole('heading', { level: 1, name: 'SensorHK/ResponseRR' })
    ).toBeInTheDocument();

    expect(screen.getByRole('tab', { name: /SensorHK/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /ResponseRR/ })).toBeInTheDocument();
  });
});
