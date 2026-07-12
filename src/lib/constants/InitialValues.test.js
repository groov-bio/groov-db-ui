import { initialValues, v2_initialValues } from './InitialValues';

describe('InitialValues constants', () => {
  describe('initialValues shape', () => {
    test('has top-level keys: about, ligands, operators', () => {
      expect(initialValues).toHaveProperty('about');
      expect(initialValues).toHaveProperty('ligands');
      expect(initialValues).toHaveProperty('operators');
      expect(Object.keys(initialValues).length).toBe(3);
    });

    test('about object has expected structure', () => {
      expect(initialValues.about).toEqual({
        alias: '',
        accession: '',
        uniProtID: '',
        family: '',
        mechanism: '',
        about: '',
      });
    });

    test('about object has exactly 6 keys', () => {
      expect(Object.keys(initialValues.about).length).toBe(6);
    });

    test('ligands is an array', () => {
      expect(Array.isArray(initialValues.ligands)).toBe(true);
    });

    test('ligands array has exactly one empty row', () => {
      expect(initialValues.ligands.length).toBe(1);
    });

    test('ligand row has expected structure', () => {
      expect(initialValues.ligands[0]).toEqual({
        name: '',
        SMILES: '',
        doi: '',
        ref_figure: '',
        fig_type: '',
        method: '',
      });
    });

    test('ligand row has exactly 6 keys', () => {
      expect(Object.keys(initialValues.ligands[0]).length).toBe(6);
    });

    test('operators is an array', () => {
      expect(Array.isArray(initialValues.operators)).toBe(true);
    });

    test('operators array has exactly one empty row', () => {
      expect(initialValues.operators.length).toBe(1);
    });

    test('operator row has expected structure', () => {
      expect(initialValues.operators[0]).toEqual({
        sequence: '',
        method: '',
        ref_figure: '',
        fig_type: '',
        doi: '',
      });
    });

    test('operator row has exactly 5 keys', () => {
      expect(Object.keys(initialValues.operators[0]).length).toBe(5);
    });

    test('all values in about are empty strings', () => {
      Object.values(initialValues.about).forEach((value) => {
        expect(value).toBe('');
      });
    });

    test('all values in ligand row are empty strings', () => {
      Object.values(initialValues.ligands[0]).forEach((value) => {
        expect(value).toBe('');
      });
    });

    test('all values in operator row are empty strings', () => {
      Object.values(initialValues.operators[0]).forEach((value) => {
        expect(value).toBe('');
      });
    });
  });

  describe('v2_initialValues shape', () => {
    test('has top-level keys: about, ligands, operators', () => {
      expect(v2_initialValues).toHaveProperty('about');
      expect(v2_initialValues).toHaveProperty('ligands');
      expect(v2_initialValues).toHaveProperty('operators');
      expect(Object.keys(v2_initialValues).length).toBe(3);
    });

    test('about object has expected structure', () => {
      expect(v2_initialValues.about).toEqual({
        alias: '',
        accession: '',
        uniProtID: '',
        family: '',
        mechanism: '',
        about: '',
      });
    });

    test('ligands is an array with one empty row', () => {
      expect(Array.isArray(v2_initialValues.ligands)).toBe(true);
      expect(v2_initialValues.ligands.length).toBe(1);
    });

    test('ligand row structure matches', () => {
      expect(v2_initialValues.ligands[0]).toEqual({
        name: '',
        SMILES: '',
        doi: '',
        ref_figure: '',
        fig_type: '',
        method: '',
      });
    });

    test('operators is an array with one empty row', () => {
      expect(Array.isArray(v2_initialValues.operators)).toBe(true);
      expect(v2_initialValues.operators.length).toBe(1);
    });

    test('operator row structure matches', () => {
      expect(v2_initialValues.operators[0]).toEqual({
        sequence: '',
        method: '',
        ref_figure: '',
        fig_type: '',
        doi: '',
      });
    });

    test('v2_initialValues and initialValues have same structure', () => {
      expect(Object.keys(v2_initialValues).sort()).toEqual(Object.keys(initialValues).sort());
    });
  });
});
