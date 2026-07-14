import {
  createEmptyLigand,
  createEmptyOperator,
  createEmptyLightStimulus,
  createEmptyTemperatureStimulus,
  createEmptyMutation,
  createEmptyProtein,
  createEmptySensor,
  createEmptySharedExperiment,
  v2_initialValues,
  getInitialValuesWithProteins,
} from '../../../../lib/constants/v2_form/initialValues';

describe('V2 Form Initial Values', () => {
  describe('createEmptyLigand factory', () => {
    test('returns object with expected keys', () => {
      const ligand = createEmptyLigand();
      expect(ligand).toHaveProperty('name');
      expect(ligand).toHaveProperty('SMILES');
      expect(ligand).toHaveProperty('doi');
      expect(ligand).toHaveProperty('ref_figure');
      expect(ligand).toHaveProperty('fig_type');
      expect(ligand).toHaveProperty('method');
      expect(ligand).toHaveProperty('regulatory_effect');
      expect(ligand).toHaveProperty('kd');
      expect(ligand).toHaveProperty('kd_unit');
    });

    test('has exactly 9 keys', () => {
      const ligand = createEmptyLigand();
      expect(Object.keys(ligand).length).toBe(9);
    });

    test('has correct default values', () => {
      const ligand = createEmptyLigand();
      expect(ligand.name).toBe('');
      expect(ligand.SMILES).toBe('');
      expect(ligand.doi).toBe('');
      expect(ligand.ref_figure).toBe('');
      expect(ligand.fig_type).toBe('');
      expect(ligand.method).toBe('');
      expect(ligand.regulatory_effect).toBe('');
      expect(ligand.kd).toBe('');
      expect(ligand.kd_unit).toBe('nM');
    });

    test('creates independent instances', () => {
      const ligand1 = createEmptyLigand();
      const ligand2 = createEmptyLigand();
      ligand1.name = 'Modified';
      expect(ligand2.name).toBe('');
    });
  });

  describe('createEmptyOperator factory', () => {
    test('returns object with expected keys', () => {
      const operator = createEmptyOperator();
      expect(operator).toHaveProperty('sequence');
      expect(operator).toHaveProperty('method');
      expect(operator).toHaveProperty('ref_figure');
      expect(operator).toHaveProperty('fig_type');
      expect(operator).toHaveProperty('doi');
      expect(operator).toHaveProperty('kd');
      expect(operator).toHaveProperty('kd_unit');
    });

    test('has exactly 7 keys', () => {
      const operator = createEmptyOperator();
      expect(Object.keys(operator).length).toBe(7);
    });

    test('has correct default values', () => {
      const operator = createEmptyOperator();
      expect(operator.sequence).toBe('');
      expect(operator.method).toBe('');
      expect(operator.ref_figure).toBe('');
      expect(operator.fig_type).toBe('');
      expect(operator.doi).toBe('');
      expect(operator.kd).toBe('');
      expect(operator.kd_unit).toBe('nM');
    });
  });

  describe('createEmptyLightStimulus factory', () => {
    test('returns object with expected keys', () => {
      const stimulus = createEmptyLightStimulus();
      expect(stimulus).toHaveProperty('wavelength');
      expect(stimulus).toHaveProperty('regulatory_effect');
      expect(stimulus).toHaveProperty('doi');
      expect(stimulus).toHaveProperty('method');
      expect(stimulus).toHaveProperty('ref_figure');
      expect(stimulus).toHaveProperty('fig_type');
    });

    test('has exactly 6 keys', () => {
      const stimulus = createEmptyLightStimulus();
      expect(Object.keys(stimulus).length).toBe(6);
    });

    test('has correct default values', () => {
      const stimulus = createEmptyLightStimulus();
      expect(stimulus.wavelength).toBe('');
      expect(stimulus.regulatory_effect).toBe('');
      expect(stimulus.doi).toBe('');
      expect(stimulus.method).toBe('');
      expect(stimulus.ref_figure).toBe('');
      expect(stimulus.fig_type).toBe('');
    });
  });

  describe('createEmptyTemperatureStimulus factory', () => {
    test('returns object with expected keys', () => {
      const stimulus = createEmptyTemperatureStimulus();
      expect(stimulus).toHaveProperty('temperature');
      expect(stimulus).toHaveProperty('regulatory_effect');
      expect(stimulus).toHaveProperty('doi');
      expect(stimulus).toHaveProperty('method');
      expect(stimulus).toHaveProperty('ref_figure');
      expect(stimulus).toHaveProperty('fig_type');
    });

    test('has exactly 6 keys', () => {
      const stimulus = createEmptyTemperatureStimulus();
      expect(Object.keys(stimulus).length).toBe(6);
    });

    test('has correct default values', () => {
      const stimulus = createEmptyTemperatureStimulus();
      expect(stimulus.temperature).toBe('');
      expect(stimulus.regulatory_effect).toBe('');
      expect(stimulus.doi).toBe('');
      expect(stimulus.method).toBe('');
      expect(stimulus.ref_figure).toBe('');
      expect(stimulus.fig_type).toBe('');
    });
  });

  describe('createEmptyMutation factory', () => {
    test('returns object with expected keys', () => {
      const mutation = createEmptyMutation();
      expect(mutation).toHaveProperty('mutations');
      expect(mutation).toHaveProperty('ref_type');
      expect(mutation).toHaveProperty('ref_id');
    });

    test('has exactly 3 keys', () => {
      const mutation = createEmptyMutation();
      expect(Object.keys(mutation).length).toBe(3);
    });

    test('has correct default values', () => {
      const mutation = createEmptyMutation();
      expect(mutation.mutations).toBe('');
      expect(mutation.ref_type).toBe('UniProt');
      expect(mutation.ref_id).toBe('');
    });
  });

  describe('createEmptyProtein factory', () => {
    test('returns object with expected keys', () => {
      const protein = createEmptyProtein();
      expect(protein).toHaveProperty('id');
      expect(protein).toHaveProperty('alias');
      expect(protein).toHaveProperty('uniProtID');
      expect(protein).toHaveProperty('accession');
      expect(protein).toHaveProperty('family');
      expect(protein).toHaveProperty('ligands');
      expect(protein).toHaveProperty('operators');
      expect(protein).toHaveProperty('light_stimuli');
      expect(protein).toHaveProperty('temperature_stimuli');
      expect(protein).toHaveProperty('mutations');
      expect(protein).toHaveProperty('toggles');
    });

    test('has exactly 11 keys', () => {
      const protein = createEmptyProtein();
      expect(Object.keys(protein).length).toBe(11);
    });

    test('id is a valid UUID string', () => {
      const protein = createEmptyProtein();
      expect(typeof protein.id).toBe('string');
      expect(protein.id.length).toBeGreaterThan(0);
    });

    test('ligands array has one empty ligand', () => {
      const protein = createEmptyProtein();
      expect(Array.isArray(protein.ligands)).toBe(true);
      expect(protein.ligands.length).toBe(1);
      expect(protein.ligands[0]).toEqual(createEmptyLigand());
    });

    test('operators array has one empty operator', () => {
      const protein = createEmptyProtein();
      expect(Array.isArray(protein.operators)).toBe(true);
      expect(protein.operators.length).toBe(1);
      expect(protein.operators[0]).toEqual(createEmptyOperator());
    });

    test('light_stimuli is an empty array', () => {
      const protein = createEmptyProtein();
      expect(Array.isArray(protein.light_stimuli)).toBe(true);
      expect(protein.light_stimuli.length).toBe(0);
    });

    test('temperature_stimuli is an empty array', () => {
      const protein = createEmptyProtein();
      expect(Array.isArray(protein.temperature_stimuli)).toBe(true);
      expect(protein.temperature_stimuli.length).toBe(0);
    });

    test('mutations is an empty array', () => {
      const protein = createEmptyProtein();
      expect(Array.isArray(protein.mutations)).toBe(true);
      expect(protein.mutations.length).toBe(0);
    });

    test('toggles has expected structure', () => {
      const protein = createEmptyProtein();
      expect(protein.toggles).toEqual({
        ligands: true,
        operators: true,
        light: false,
        temperature: false,
      });
    });

    test('creates independent instances with different IDs', () => {
      const protein1 = createEmptyProtein();
      const protein2 = createEmptyProtein();
      expect(protein1.id).not.toBe(protein2.id);
    });
  });

  describe('createEmptySensor factory', () => {
    test('returns object with expected keys', () => {
      const sensor = createEmptySensor();
      expect(sensor).toHaveProperty('mechanism');
      expect(sensor).toHaveProperty('about');
    });

    test('has exactly 2 keys', () => {
      const sensor = createEmptySensor();
      expect(Object.keys(sensor).length).toBe(2);
    });

    test('has correct default values', () => {
      const sensor = createEmptySensor();
      expect(sensor.mechanism).toBe('');
      expect(sensor.about).toBe('');
    });
  });

  describe('createEmptySharedExperiment factory', () => {
    test('returns an object', () => {
      const shared = createEmptySharedExperiment();
      expect(typeof shared).toBe('object');
      expect(shared).not.toBe(null);
    });

    test('is an empty placeholder object', () => {
      const shared = createEmptySharedExperiment();
      expect(Object.keys(shared).length).toBe(0);
    });
  });

  describe('v2_initialValues', () => {
    test('has top-level keys: sensor, proteins, shared', () => {
      expect(v2_initialValues).toHaveProperty('sensor');
      expect(v2_initialValues).toHaveProperty('proteins');
      expect(v2_initialValues).toHaveProperty('shared');
      expect(Object.keys(v2_initialValues).length).toBe(3);
    });

    test('sensor is an empty sensor object', () => {
      expect(v2_initialValues.sensor).toEqual(createEmptySensor());
    });

    test('proteins array has exactly one protein', () => {
      expect(Array.isArray(v2_initialValues.proteins)).toBe(true);
      expect(v2_initialValues.proteins.length).toBe(1);
    });

    test('first protein has expected structure', () => {
      const protein = v2_initialValues.proteins[0];
      expect(protein).toHaveProperty('id');
      expect(protein).toHaveProperty('alias');
      expect(protein).toHaveProperty('ligands');
      expect(protein).toHaveProperty('operators');
    });

    test('shared object has experiment key', () => {
      expect(v2_initialValues.shared).toHaveProperty('experiment');
      expect(typeof v2_initialValues.shared.experiment).toBe('object');
    });
  });

  describe('getInitialValuesWithProteins helper', () => {
    test('default count is 1', () => {
      const values = getInitialValuesWithProteins();
      expect(values.proteins.length).toBe(1);
    });

    test('returns correct structure for count 1', () => {
      const values = getInitialValuesWithProteins(1);
      expect(values).toHaveProperty('sensor');
      expect(values).toHaveProperty('proteins');
      expect(values).toHaveProperty('shared');
      expect(values.proteins.length).toBe(1);
    });

    test('returns correct structure for count 2', () => {
      const values = getInitialValuesWithProteins(2);
      expect(values.proteins.length).toBe(2);
    });

    test('returns correct structure for count 5', () => {
      const values = getInitialValuesWithProteins(5);
      expect(values.proteins.length).toBe(5);
    });

    test('all proteins have different IDs', () => {
      const values = getInitialValuesWithProteins(3);
      const ids = values.proteins.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    test('each protein is an empty protein object', () => {
      const values = getInitialValuesWithProteins(2);
      values.proteins.forEach((protein) => {
        expect(protein).toHaveProperty('id');
        expect(protein).toHaveProperty('alias');
        expect(protein).toHaveProperty('uniProtID');
        expect(protein.ligands.length).toBe(1);
        expect(protein.operators.length).toBe(1);
      });
    });
  });
});
