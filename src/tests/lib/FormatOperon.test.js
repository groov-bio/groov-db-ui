import { generateGraphic } from '../../lib/FormatOperon';

describe('generateGraphic', () => {
  // Helper function to create test operon data
  const createGene = (start, stop, direction = 'forward', description = 'test gene', link = 'http://example.com') => ({
    start,
    stop,
    direction,
    description,
    link,
  });

  describe('basic structure and array length', () => {
    it('should return an array with same length as input', () => {
      const operonData = [
        createGene(0, 1000),
        createGene(1000, 2000),
        createGene(2000, 3000),
      ];
      const result = generateGraphic(operonData, 0);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3); // 3 genes -> 3 entries
    });

    it('should return array with two entries for two genes', () => {
      const operonData = [
        createGene(0, 1000),
        createGene(1000, 2000),
      ];
      const result = generateGraphic(operonData, 0);
      expect(result.length).toBe(2);
    });
  });

  describe('graphic object structure', () => {
    it('should include all required keys in each graphic object', () => {
      const operonData = [
        createGene(0, 1000),
        createGene(1000, 2000),
      ];
      const result = generateGraphic(operonData, 0);

      const requiredKeys = ['length', 'description', 'color', 'direction', 'spacer', 'link'];
      result.forEach(graphic => {
        requiredKeys.forEach(key => {
          expect(graphic).toHaveProperty(key);
        });
      });
    });

    it('should have length and spacer as percentage strings', () => {
      const operonData = [
        createGene(0, 1000),
        createGene(1000, 2000),
      ];
      const result = generateGraphic(operonData, 0);

      result.forEach(graphic => {
        expect(graphic.length).toMatch(/^\d+%$/);
        expect(graphic.spacer).toMatch(/^\d+%$/);
      });
    });
  });

  describe('subject gene color', () => {
    it('should assign subject color to gene at reg_index', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'regulator gene'),
        createGene(1000, 2000, 'forward', 'other gene'),
        createGene(2000, 3000, 'forward', 'another gene'),
      ];
      const reg_index = 1;
      const result = generateGraphic(operonData, reg_index);

      expect(result[1].color).toBe('#0be300'); // subject_color
    });

    it('should assign subject color only to the reg_index gene', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'regulator gene'),
        createGene(1000, 2000, 'forward', 'subject gene'),
        createGene(2000, 3000, 'forward', 'pump gene'),
      ];
      const reg_index = 1;
      const result = generateGraphic(operonData, reg_index);

      expect(result[0].color).not.toBe('#0be300');
      expect(result[1].color).toBe('#0be300');
      expect(result[2].color).not.toBe('#0be300');
    });
  });

  describe('gene type color assignment', () => {
    it('should assign regulator_color to genes with "regulator" in description', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'regulator'),
        createGene(1000, 2000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, -1); // No subject

      expect(result[0].color).toBe('#1b96fa'); // regulator_color
    });

    it('should assign regulator_color to genes with "repressor" in description', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'repressor protein'),
        createGene(1000, 2000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].color).toBe('#1b96fa');
    });

    it('should assign regulator_color to genes with "activator" in description', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'activator'),
        createGene(1000, 2000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].color).toBe('#1b96fa');
    });

    it('should assign transporter_color to genes with "pump" in description', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'pump'),
        createGene(1000, 2000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].color).toBe('#fff700'); // transporter_color
    });

    it('should assign transporter_color to genes with "channel" in description', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'channel protein'),
        createGene(1000, 2000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].color).toBe('#fff700');
    });

    it('should assign transporter_color to genes with "port" in description', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'transport port'),
        createGene(1000, 2000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].color).toBe('#fff700');
    });

    it('should assign enzyme_color to genes with "ase" in description', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'oxygenase'),
        createGene(1000, 2000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].color).toBe('#fc4e4e'); // enzyme_color
    });

    it('should assign enzyme_color to genes with "P450" in description', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'P450'),
        createGene(1000, 2000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].color).toBe('#fc4e4e');
    });

    it('should assign other_color to genes without recognized type', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'hypothetical protein'),
        createGene(1000, 2000, 'forward', 'unknown function'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].color).toBe('#545454'); // other_color
      expect(result[1].color).toBe('#545454');
    });
  });

  describe('description handling', () => {
    it('should pass through description from operon_data', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'custom description'),
        createGene(1000, 2000, 'forward', 'another description'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].description).toBe('custom description');
      expect(result[1].description).toBe('another description');
    });

    it('should have undefined description when operon_data lacks description property', () => {
      // Note: The code has a try-catch meant to handle missing descriptions,
      // but it doesn't work because property access doesn't throw an error.
      // Accessing undefined property just returns undefined.
      const operonData = [
        { start: 0, stop: 1000, direction: 'forward', link: 'http://example.com' },
        { start: 1000, stop: 2000, direction: 'forward', link: 'http://example.com' },
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].description).toBe(undefined);
      expect(result[1].description).toBe(undefined);
    });
  });

  describe('direction passthrough', () => {
    it('should preserve direction from operon_data', () => {
      const operonData = [
        createGene(0, 1000, 'forward'),
        createGene(1000, 2000, 'reverse'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].direction).toBe('forward');
      expect(result[1].direction).toBe('reverse');
    });
  });

  describe('link passthrough', () => {
    it('should preserve link from operon_data', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'gene1', 'http://link1.com'),
        createGene(1000, 2000, 'forward', 'gene2', 'http://link2.com'),
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].link).toBe('http://link1.com');
      expect(result[1].link).toBe('http://link2.com');
    });
  });

  describe('length calculation', () => {
    it('should calculate length as percentage', () => {
      const operonData = [
        createGene(0, 1000),
        createGene(1000, 2000),
      ];
      const result = generateGraphic(operonData, -1);

      result.forEach(graphic => {
        const percentage = parseInt(graphic.length);
        expect(percentage).toBeGreaterThanOrEqual(0);
        expect(percentage).toBeLessThanOrEqual(100);
      });
    });

    it('should handle genes with reversed start/stop positions', () => {
      const operonData = [
        createGene(1000, 0), // reversed
        createGene(2000, 1000), // reversed
      ];
      const result = generateGraphic(operonData, -1);

      // Should still produce valid percentages
      expect(result[0].length).toMatch(/^\d+%$/);
      expect(result[1].length).toMatch(/^\d+%$/);
    });
  });

  describe('spacer calculation', () => {
    it('should calculate spacer as percentage', () => {
      const operonData = [
        createGene(0, 1000),
        createGene(2000, 3000), // 1000 bp gap
      ];
      const result = generateGraphic(operonData, -1);

      result.forEach(graphic => {
        const percentage = parseInt(graphic.spacer);
        expect(percentage).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have zero spacer for overlapping genes', () => {
      const operonData = [
        createGene(0, 2000),
        createGene(1000, 3000), // overlapping
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].spacer).toBe('0%');
    });

    it('should have zero spacer for contiguous genes', () => {
      const operonData = [
        createGene(0, 1000),
        createGene(1000, 2000), // no gap
      ];
      const result = generateGraphic(operonData, -1);

      expect(result[0].spacer).toBe('0%');
    });
  });

  describe('subject color overrides gene type color', () => {
    it('should assign subject color even to regulator genes at reg_index', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'other gene'),
        createGene(1000, 2000, 'forward', 'regulator'), // would be blue normally
        createGene(2000, 3000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, 1); // Subject is at index 1

      expect(result[1].color).toBe('#0be300'); // Should be green, not blue
    });

    it('should assign subject color to pump at reg_index', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'other gene'),
        createGene(1000, 2000, 'forward', 'pump protein'),
        createGene(2000, 3000, 'forward', 'other gene'),
      ];
      const result = generateGraphic(operonData, 1);

      expect(result[1].color).toBe('#0be300'); // Should be green, not yellow
    });
  });

  describe('realistic operon scenarios', () => {
    it('should handle a typical operon with multiple genes', () => {
      const operonData = [
        createGene(1000, 2000, 'forward', 'repressor', 'http://link1.com'),
        createGene(2500, 3500, 'forward', 'pump', 'http://link2.com'),
        createGene(4000, 5000, 'forward', 'oxygenase', 'http://link3.com'),
        createGene(5500, 6500, 'forward', 'hypothetical protein', 'http://link4.com'),
      ];
      const result = generateGraphic(operonData, 0); // regulator is subject

      expect(result.length).toBe(4); // Returns same length as input
      expect(result[0].color).toBe('#0be300'); // Subject (regulator -> green)
      expect(result[1].color).toBe('#fff700'); // Pump (yellow)
      expect(result[2].color).toBe('#fc4e4e'); // Oxygenase (red)
      expect(result[3].color).toBe('#545454'); // Hypothetical (gray)
    });

    it('should handle genes with reversed directions', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'gene A'),
        createGene(2000, 1500, 'reverse', 'gene B'), // reversed direction and positions
      ];
      const result = generateGraphic(operonData, 1);

      expect(result[0].direction).toBe('forward');
      expect(result[1].direction).toBe('reverse');
      expect(result[1].color).toBe('#0be300'); // Subject color
    });

    it('should handle large operons with multiple spacers', () => {
      const operonData = [
        createGene(0, 500, 'forward', 'gene1'),
        createGene(1500, 2000, 'forward', 'gene2'),
        createGene(3500, 4000, 'forward', 'gene3'),
      ];
      const result = generateGraphic(operonData, 1);

      expect(result.length).toBe(3); // Returns same length as input
      // All should have numeric percentages
      expect(result[0].length).toMatch(/^\d+%$/);
      expect(result[0].spacer).toMatch(/^\d+%$/);
      expect(result[1].length).toMatch(/^\d+%$/);
      expect(result[1].spacer).toMatch(/^\d+%$/);
      expect(result[2].length).toMatch(/^\d+%$/);
      expect(result[2].spacer).toMatch(/^\d+%$/);
    });
  });

  describe('edge cases', () => {
    it('should handle genes with zero length', () => {
      const operonData = [
        createGene(1000, 1000, 'forward', 'zero length gene'),
        createGene(2000, 3000, 'forward', 'normal gene'),
      ];
      const result = generateGraphic(operonData, 0);

      expect(result[0].length).toMatch(/^\d+%$/);
      expect(result[0].length).toBe('0%'); // 0 length should give 0%
    });

    it('should handle very close genes', () => {
      const operonData = [
        createGene(0, 1000, 'forward', 'gene1'),
        createGene(1001, 2000, 'forward', 'gene2'),
      ];
      const result = generateGraphic(operonData, 0);

      expect(result[0].spacer).toMatch(/^\d+%$/);
    });
  });
});
