import {
  ligandMethods,
  operatorMethods,
  figureTypes,
  regulatoryEffects,
  splitFigure,
  joinFigure,
} from '../../../../lib/constants/v2_form/experimentalMethods';

describe('Experimental Methods Constants', () => {
  describe('ligandMethods array', () => {
    test('is an array of strings', () => {
      expect(Array.isArray(ligandMethods)).toBe(true);
      expect(ligandMethods.every((method) => typeof method === 'string')).toBe(true);
    });

    test('has at least one method', () => {
      expect(ligandMethods.length).toBeGreaterThan(0);
    });

    test('contains expected methods', () => {
      expect(ligandMethods).toContain('EMSA');
      expect(ligandMethods).toContain('DNase footprinting');
      expect(ligandMethods).toContain('Isothermal titration calorimetry');
      expect(ligandMethods).toContain('Surface plasmon resonance');
      expect(ligandMethods).toContain('Fluorescence polarization');
      expect(ligandMethods).toContain('Synthetic regulation');
      expect(ligandMethods).toContain('Thermal shift');
      expect(ligandMethods).toContain('Spectrophotometric competition');
      expect(ligandMethods).toContain('Spectral shift');
      expect(ligandMethods).toContain('DNA affinity chromatography');
      expect(ligandMethods).toContain('Autophosphorylation assay');
    });

    test('has exactly 11 methods', () => {
      expect(ligandMethods.length).toBe(11);
    });
  });

  describe('operatorMethods array', () => {
    test('is an array of strings', () => {
      expect(Array.isArray(operatorMethods)).toBe(true);
      expect(operatorMethods.every((method) => typeof method === 'string')).toBe(true);
    });

    test('has at least one method', () => {
      expect(operatorMethods.length).toBeGreaterThan(0);
    });

    test('contains expected methods', () => {
      expect(operatorMethods).toContain('EMSA');
      expect(operatorMethods).toContain('DNase footprinting');
      expect(operatorMethods).toContain('Surface plasmon resonance');
      expect(operatorMethods).toContain('Crystal structure');
      expect(operatorMethods).toContain('Isothermal titration calorimetry');
      expect(operatorMethods).toContain('Fluorescence polarization');
      expect(operatorMethods).toContain('Synthetic regulation');
      expect(operatorMethods).toContain('ChIP-Seq');
    });

    test('has exactly 8 methods', () => {
      expect(operatorMethods.length).toBe(8);
    });

    test('shares some common methods with ligandMethods', () => {
      const commonMethods = ligandMethods.filter((m) => operatorMethods.includes(m));
      expect(commonMethods.length).toBeGreaterThan(0);
    });
  });

  describe('figureTypes array', () => {
    test('is an array of strings', () => {
      expect(Array.isArray(figureTypes)).toBe(true);
      expect(figureTypes.every((type) => typeof type === 'string')).toBe(true);
    });

    test('contains expected types', () => {
      expect(figureTypes).toContain('Figure');
      expect(figureTypes).toContain('Supplementary Figure');
      expect(figureTypes).toContain('Table');
      expect(figureTypes).toContain('Supplementary Table');
    });

    test('has exactly 4 types', () => {
      expect(figureTypes.length).toBe(4);
    });
  });

  describe('regulatoryEffects array', () => {
    test('is an array of strings', () => {
      expect(Array.isArray(regulatoryEffects)).toBe(true);
      expect(regulatoryEffects.every((effect) => typeof effect === 'string')).toBe(true);
    });

    test('contains expected effects', () => {
      expect(regulatoryEffects).toContain('activates');
      expect(regulatoryEffects).toContain('represses');
    });

    test('has exactly 2 effects', () => {
      expect(regulatoryEffects.length).toBe(2);
    });
  });

  describe('splitFigure function', () => {
    test('splits "Figure 1" correctly', () => {
      const result = splitFigure('Figure 1');
      expect(result).toEqual({ figType: 'Figure', num: '1' });
    });

    test('splits "Figure 1A" correctly', () => {
      const result = splitFigure('Figure 1A');
      expect(result).toEqual({ figType: 'Figure', num: '1A' });
    });

    test('splits "Figure S1" correctly', () => {
      const result = splitFigure('Figure S1');
      expect(result).toEqual({ figType: 'Supplementary Figure', num: '1' });
    });

    test('splits "Figure S1A" correctly', () => {
      const result = splitFigure('Figure S1A');
      expect(result).toEqual({ figType: 'Supplementary Figure', num: '1A' });
    });

    test('splits "Table 1" correctly', () => {
      const result = splitFigure('Table 1');
      expect(result).toEqual({ figType: 'Table', num: '1' });
    });

    test('splits "Table S1" correctly', () => {
      const result = splitFigure('Table S1');
      expect(result).toEqual({ figType: 'Supplementary Table', num: '1' });
    });

    test('splits "Table S1A" correctly', () => {
      const result = splitFigure('Table S1A');
      expect(result).toEqual({ figType: 'Supplementary Table', num: '1A' });
    });

    test('handles case-insensitive input "figure 1"', () => {
      const result = splitFigure('figure 1');
      expect(result.figType).toBe('Figure');
      expect(result.num).toBe('1');
    });

    test('handles case-insensitive input "FIGURE 1"', () => {
      const result = splitFigure('FIGURE 1');
      expect(result.figType).toBe('Figure');
      expect(result.num).toBe('1');
    });

    test('handles case-insensitive input "table S1"', () => {
      const result = splitFigure('table s1');
      expect(result.figType).toBe('Supplementary Table');
      expect(result.num).toBe('1');
    });

    test('handles empty string', () => {
      const result = splitFigure('');
      expect(result).toEqual({ figType: 'Figure', num: '' });
    });

    test('handles null input', () => {
      const result = splitFigure(null);
      expect(result).toEqual({ figType: 'Figure', num: '' });
    });

    test('handles whitespace-only string', () => {
      const result = splitFigure('   ');
      expect(result.figType).toBe('Figure');
    });

    test('handles unmatched pattern as Figure with full string', () => {
      const result = splitFigure('SomeUnmatchedString');
      expect(result.figType).toBe('Figure');
      expect(result.num).toBe('SomeUnmatchedString');
    });

    test('handles "Figure 10A" correctly', () => {
      const result = splitFigure('Figure 10A');
      expect(result).toEqual({ figType: 'Figure', num: '10A' });
    });
  });

  describe('joinFigure function', () => {
    test('joins Figure + "1" to "Figure 1"', () => {
      const result = joinFigure('Figure', '1');
      expect(result).toBe('Figure 1');
    });

    test('joins Figure + "1A" to "Figure 1A"', () => {
      const result = joinFigure('Figure', '1A');
      expect(result).toBe('Figure 1A');
    });

    test('joins Supplementary Figure + "1" to "Figure S1"', () => {
      const result = joinFigure('Supplementary Figure', '1');
      expect(result).toBe('Figure S1');
    });

    test('joins Supplementary Figure + "1A" to "Figure S1A"', () => {
      const result = joinFigure('Supplementary Figure', '1A');
      expect(result).toBe('Figure S1A');
    });

    test('joins Table + "1" to "Table 1"', () => {
      const result = joinFigure('Table', '1');
      expect(result).toBe('Table 1');
    });

    test('joins Supplementary Table + "1" to "Table S1"', () => {
      const result = joinFigure('Supplementary Table', '1');
      expect(result).toBe('Table S1');
    });

    test('joins Supplementary Table + "1A" to "Table S1A"', () => {
      const result = joinFigure('Supplementary Table', '1A');
      expect(result).toBe('Table S1A');
    });

    test('returns null when num is empty', () => {
      const result = joinFigure('Figure', '');
      expect(result).toBe(null);
    });

    test('returns null when num is null', () => {
      const result = joinFigure('Figure', null);
      expect(result).toBe(null);
    });

    test('returns null when num is whitespace only', () => {
      const result = joinFigure('Figure', '   ');
      expect(result).toBe(null);
    });

    test('handles numeric num by converting to string', () => {
      const result = joinFigure('Figure', 1);
      expect(result).toBe('Figure 1');
    });

    test('unknown figType defaults to Figure', () => {
      const result = joinFigure('UnknownType', '5');
      expect(result).toBe('Figure 5');
    });

    test('round-trip: splitFigure -> joinFigure preserves "Figure 1"', () => {
      const original = 'Figure 1';
      const split = splitFigure(original);
      const joined = joinFigure(split.figType, split.num);
      expect(joined).toBe(original);
    });

    test('round-trip: splitFigure -> joinFigure preserves "Figure S1A"', () => {
      const original = 'Figure S1A';
      const split = splitFigure(original);
      const joined = joinFigure(split.figType, split.num);
      expect(joined).toBe(original);
    });

    test('round-trip: splitFigure -> joinFigure preserves "Table 5"', () => {
      const original = 'Table 5';
      const split = splitFigure(original);
      const joined = joinFigure(split.figType, split.num);
      expect(joined).toBe(original);
    });

    test('round-trip: splitFigure -> joinFigure preserves "Table S2A"', () => {
      const original = 'Table S2A';
      const split = splitFigure(original);
      const joined = joinFigure(split.figType, split.num);
      expect(joined).toBe(original);
    });
  });
});
