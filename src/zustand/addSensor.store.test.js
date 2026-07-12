import { useAddSensorStore } from './addSensor.store';

describe('useAddSensorStore', () => {
  beforeEach(() => {
    useAddSensorStore.setState({
      about: {
        alias: '',
        accession: '',
        uniProtID: '',
        family: '',
        mechanism: '',
        about: '',
      },
      ligands: [
        {
          name: '',
          SMILES: '',
          doi: '',
          ref_figure: '',
          fig_type: '',
          method: '',
        },
      ],
      operators: [
        {
          sequence: '',
          method: '',
          ref_figure: '',
          fig_type: '',
          doi: '',
        },
      ],
      errors: {
        about: {},
        ligands: {},
        operators: {},
      },
      insertFormApi: {
        status: null,
        num: null,
        message: null,
      },
    });
  });

  describe('initialization', () => {
    test('initializes with proper about object structure', () => {
      const state = useAddSensorStore.getState();
      expect(state.about).toEqual({
        alias: '',
        accession: '',
        uniProtID: '',
        family: '',
        mechanism: '',
        about: '',
      });
    });

    test('initializes with one empty ligand entry', () => {
      const state = useAddSensorStore.getState();
      expect(state.ligands.length).toBe(1);
      expect(state.ligands[0]).toEqual({
        name: '',
        SMILES: '',
        doi: '',
        ref_figure: '',
        fig_type: '',
        method: '',
      });
    });

    test('initializes with one empty operator entry', () => {
      const state = useAddSensorStore.getState();
      expect(state.operators.length).toBe(1);
      expect(state.operators[0]).toEqual({
        sequence: '',
        method: '',
        ref_figure: '',
        fig_type: '',
        doi: '',
      });
    });

    test('initializes with empty errors object', () => {
      const state = useAddSensorStore.getState();
      expect(state.errors).toEqual({
        about: {},
        ligands: {},
        operators: {},
      });
    });

    test('initializes insertFormApi with null values', () => {
      const state = useAddSensorStore.getState();
      expect(state.insertFormApi).toEqual({
        status: null,
        num: null,
        message: null,
      });
    });
  });

  describe('updateField', () => {
    test('updates a field in the about object', () => {
      useAddSensorStore.getState().updateField('about', 'alias', 'TestSensor');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.about.alias).toBe('TestSensor');
    });

    test('updates multiple fields in about independently', () => {
      useAddSensorStore.getState().updateField('about', 'alias', 'TestSensor');
      useAddSensorStore.getState().updateField('about', 'family', 'TetR');
      useAddSensorStore.getState().updateField('about', 'uniProtID', 'P0ACU5');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.about.alias).toBe('TestSensor');
      expect(updatedState.about.family).toBe('TetR');
      expect(updatedState.about.uniProtID).toBe('P0ACU5');
    });

    test('preserves other fields when updating one', () => {
      useAddSensorStore.getState().updateField('about', 'alias', 'TestSensor');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.about.alias).toBe('TestSensor');
      expect(updatedState.about.family).toBe('');
      expect(updatedState.about.accession).toBe('');
    });
  });

  describe('updateArrayField', () => {
    test('updates a field in a ligand array entry', () => {
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'name', 'TestLigand');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.ligands[0].name).toBe('TestLigand');
    });

    test('updates multiple fields in the same ligand entry', () => {
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'name', 'TestLigand');
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'SMILES', 'C1=CC=CC=C1');
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'doi', '10.1234/test');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.ligands[0].name).toBe('TestLigand');
      expect(updatedState.ligands[0].SMILES).toBe('C1=CC=CC=C1');
      expect(updatedState.ligands[0].doi).toBe('10.1234/test');
    });

    test('updates operator array entries', () => {
      useAddSensorStore.getState().updateArrayField('operators', 0, 'sequence', 'ATGCGATCG');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.operators[0].sequence).toBe('ATGCGATCG');
    });

    test('does not affect other entries in the array', () => {
      useAddSensorStore.getState().addLigandEntry();
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'name', 'Ligand1');
      useAddSensorStore.getState().updateArrayField('ligands', 1, 'name', 'Ligand2');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.ligands[0].name).toBe('Ligand1');
      expect(updatedState.ligands[1].name).toBe('Ligand2');
    });

    test('preserves other fields in the same entry', () => {
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'name', 'TestLigand');
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'SMILES', 'SMILES_STRING');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.ligands[0].name).toBe('TestLigand');
      expect(updatedState.ligands[0].SMILES).toBe('SMILES_STRING');
      expect(updatedState.ligands[0].doi).toBe('');
    });
  });

  describe('addLigandEntry', () => {
    test('adds a new empty ligand entry', () => {
      expect(useAddSensorStore.getState().ligands.length).toBe(1);

      useAddSensorStore.getState().addLigandEntry();

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.ligands.length).toBe(2);
      expect(updatedState.ligands[1]).toEqual({
        name: '',
        SMILES: '',
        doi: '',
        ref_figure: '',
        fig_type: '',
        method: '',
      });
    });

    test('can add multiple ligand entries', () => {
      useAddSensorStore.getState().addLigandEntry();
      useAddSensorStore.getState().addLigandEntry();

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.ligands.length).toBe(3);
    });

    test('new ligand entries are independent', () => {
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'name', 'Ligand1');
      useAddSensorStore.getState().addLigandEntry();
      useAddSensorStore.getState().updateArrayField('ligands', 1, 'name', 'Ligand2');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.ligands[0].name).toBe('Ligand1');
      expect(updatedState.ligands[1].name).toBe('Ligand2');
    });
  });

  describe('addOperatorEntry', () => {
    test('adds a new empty operator entry', () => {
      expect(useAddSensorStore.getState().operators.length).toBe(1);

      useAddSensorStore.getState().addOperatorEntry();

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.operators.length).toBe(2);
      expect(updatedState.operators[1]).toEqual({
        sequence: '',
        method: '',
        ref_figure: '',
        fig_type: '',
        doi: '',
      });
    });

    test('can add multiple operator entries', () => {
      useAddSensorStore.getState().addOperatorEntry();
      useAddSensorStore.getState().addOperatorEntry();

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.operators.length).toBe(3);
    });

    test('new operator entries are independent', () => {
      useAddSensorStore.getState().updateArrayField('operators', 0, 'sequence', 'ATGC');
      useAddSensorStore.getState().addOperatorEntry();
      useAddSensorStore.getState().updateArrayField('operators', 1, 'sequence', 'GCTA');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.operators[0].sequence).toBe('ATGC');
      expect(updatedState.operators[1].sequence).toBe('GCTA');
    });
  });

  describe('removeArrayEntry', () => {
    test('removes a ligand entry at the specified index', () => {
      useAddSensorStore.getState().addLigandEntry();
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'name', 'Ligand1');
      useAddSensorStore.getState().updateArrayField('ligands', 1, 'name', 'Ligand2');
      expect(useAddSensorStore.getState().ligands.length).toBe(2);

      useAddSensorStore.getState().removeArrayEntry(0, 'ligands');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.ligands.length).toBe(1);
      expect(updatedState.ligands[0].name).toBe('Ligand2');
    });

    test('removes an operator entry at the specified index', () => {
      useAddSensorStore.getState().addOperatorEntry();
      useAddSensorStore.getState().updateArrayField('operators', 0, 'sequence', 'ATGC');
      useAddSensorStore.getState().updateArrayField('operators', 1, 'sequence', 'GCTA');

      useAddSensorStore.getState().removeArrayEntry(1, 'operators');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.operators.length).toBe(1);
      expect(updatedState.operators[0].sequence).toBe('ATGC');
    });

    test('removes entry from middle of array', () => {
      useAddSensorStore.getState().addLigandEntry();
      useAddSensorStore.getState().addLigandEntry();
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'name', 'Ligand1');
      useAddSensorStore.getState().updateArrayField('ligands', 1, 'name', 'Ligand2');
      useAddSensorStore.getState().updateArrayField('ligands', 2, 'name', 'Ligand3');

      useAddSensorStore.getState().removeArrayEntry(1, 'ligands');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.ligands.length).toBe(2);
      expect(updatedState.ligands[0].name).toBe('Ligand1');
      expect(updatedState.ligands[1].name).toBe('Ligand3');
    });
  });

  describe('addError', () => {
    test('adds an error to the about field', () => {
      useAddSensorStore.getState().addError('about', 'alias', 'required');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.errors.about.alias).toBe('required');
    });

    test('adds errors to ligands field', () => {
      useAddSensorStore.getState().addError('ligands', 'ligand_0_name', 'required');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.errors.ligands.ligand_0_name).toBe('required');
    });

    test('adds multiple errors to the same field section', () => {
      useAddSensorStore.getState().addError('about', 'alias', 'required');
      useAddSensorStore.getState().addError('about', 'family', 'required');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.errors.about.alias).toBe('required');
      expect(updatedState.errors.about.family).toBe('required');
    });

    test('can replace an existing error', () => {
      useAddSensorStore.getState().addError('about', 'alias', 'required');
      useAddSensorStore.getState().addError('about', 'alias', 'invalid');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.errors.about.alias).toBe('invalid');
    });
  });

  describe('popError', () => {
    test('removes an error from the about field', () => {
      useAddSensorStore.getState().addError('about', 'alias', 'required');
      expect(useAddSensorStore.getState().errors.about.alias).toBe('required');

      useAddSensorStore.getState().popError('about', 'alias');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.errors.about.alias).toBeUndefined();
    });

    test('removes an error from ligands field', () => {
      useAddSensorStore.getState().addError('ligands', 'ligand_0_name', 'required');
      useAddSensorStore.getState().popError('ligands', 'ligand_0_name');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.errors.ligands.ligand_0_name).toBeUndefined();
    });

    test('does not affect other errors in the same field section', () => {
      useAddSensorStore.getState().addError('about', 'alias', 'required');
      useAddSensorStore.getState().addError('about', 'family', 'required');

      useAddSensorStore.getState().popError('about', 'alias');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.errors.about.alias).toBeUndefined();
      expect(updatedState.errors.about.family).toBe('required');
    });

    test('does not affect errors in other field sections', () => {
      useAddSensorStore.getState().addError('about', 'alias', 'required');
      useAddSensorStore.getState().addError('ligands', 'ligand_0_name', 'required');

      useAddSensorStore.getState().popError('about', 'alias');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.errors.about.alias).toBeUndefined();
      expect(updatedState.errors.ligands.ligand_0_name).toBe('required');
    });
  });

  describe('updateFormApiStatus', () => {
    test('updates insertFormApi status', () => {
      useAddSensorStore.getState().updateFormApiStatus('pending');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.insertFormApi.status).toBe('pending');
    });

    test('increments num when updateFormApiStatus is called', () => {
      const initialNum = useAddSensorStore.getState().insertFormApi.num;

      useAddSensorStore.getState().updateFormApiStatus('pending');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.insertFormApi.num).toBe(initialNum + 1);
    });

    test('can set message when updateFormApiStatus is called', () => {
      useAddSensorStore.getState().updateFormApiStatus('error', 'Network error');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.insertFormApi.status).toBe('error');
      expect(updatedState.insertFormApi.message).toBe('Network error');
    });

    test('increments num multiple times independently', () => {
      const initialNum = useAddSensorStore.getState().insertFormApi.num;

      useAddSensorStore.getState().updateFormApiStatus('pending');
      useAddSensorStore.getState().updateFormApiStatus('error', 'Failed');
      useAddSensorStore.getState().updateFormApiStatus('success', 'Added');

      const updatedState = useAddSensorStore.getState();
      expect(updatedState.insertFormApi.num).toBe(initialNum + 3);
    });
  });

  describe('reset', () => {
    test('resets the entire store to initial state', () => {
      useAddSensorStore.getState().updateField('about', 'alias', 'TestSensor');
      useAddSensorStore.getState().addLigandEntry();
      useAddSensorStore.getState().addError('about', 'alias', 'required');

      useAddSensorStore.getState().reset();

      const resetState = useAddSensorStore.getState();
      expect(resetState.about.alias).toBe('');
      expect(resetState.ligands.length).toBe(1);
      expect(resetState.errors.about.alias).toBeUndefined();
    });

    test('reset clears all about fields', () => {
      useAddSensorStore.getState().updateField('about', 'alias', 'TestSensor');
      useAddSensorStore.getState().updateField('about', 'family', 'TetR');
      useAddSensorStore.getState().updateField('about', 'uniProtID', 'P0ACU5');

      useAddSensorStore.getState().reset();

      const resetState = useAddSensorStore.getState();
      expect(resetState.about).toEqual({
        alias: '',
        accession: '',
        uniProtID: '',
        family: '',
        mechanism: '',
        about: '',
      });
    });

    test('reset restores ligands to single empty entry', () => {
      useAddSensorStore.getState().addLigandEntry();
      useAddSensorStore.getState().addLigandEntry();
      useAddSensorStore.getState().updateArrayField('ligands', 0, 'name', 'Ligand1');

      useAddSensorStore.getState().reset();

      const resetState = useAddSensorStore.getState();
      expect(resetState.ligands.length).toBe(1);
      expect(resetState.ligands[0]).toEqual({
        name: '',
        SMILES: '',
        doi: '',
        ref_figure: '',
        fig_type: '',
        method: '',
      });
    });

    test('reset restores operators to single empty entry', () => {
      useAddSensorStore.getState().addOperatorEntry();
      useAddSensorStore.getState().updateArrayField('operators', 0, 'sequence', 'ATGC');

      useAddSensorStore.getState().reset();

      const resetState = useAddSensorStore.getState();
      expect(resetState.operators.length).toBe(1);
      expect(resetState.operators[0]).toEqual({
        sequence: '',
        method: '',
        ref_figure: '',
        fig_type: '',
        doi: '',
      });
    });

    test('reset clears all errors', () => {
      useAddSensorStore.getState().addError('about', 'alias', 'required');
      useAddSensorStore.getState().addError('ligands', 'ligand_0_name', 'required');
      useAddSensorStore.getState().addError('operators', 'operator_0_sequence', 'required');

      useAddSensorStore.getState().reset();

      const resetState = useAddSensorStore.getState();
      expect(resetState.errors).toEqual({
        about: {},
        ligands: {},
        operators: {},
      });
    });

    test('reset clears insertFormApi', () => {
      useAddSensorStore.getState().updateFormApiStatus('success', 'Added');

      useAddSensorStore.getState().reset();

      const resetState = useAddSensorStore.getState();
      expect(resetState.insertFormApi).toEqual({
        status: null,
        num: null,
        message: null,
      });
    });
  });
});
