import * as Yup from 'yup';
import { v2_validationSchema } from './validationSchema';

describe('V2 Validation Schema', () => {
  const createValidProtein = () => ({
    id: '123e4567-e89b-12d3-a456-426614174000',
    alias: 'TetR_001',
    uniProtID: 'TETR_ECOLI',
    accession: 'P0ACU5',
    family: 'TetR',
    ligands: [
      {
        name: 'Tetracycline',
        SMILES: 'CC(C)C',
        doi: '10.1234/test',
        method: 'EMSA',
        fig_type: 'Figure',
        ref_figure: '1A',
        regulatory_effect: 'represses',
        kd: '10',
        kd_unit: 'nM',
      },
    ],
    operators: [],
    light_stimuli: [],
    temperature_stimuli: [],
    mutations: [],
    toggles: {
      ligands: true,
      operators: true,
      light: false,
      temperature: false,
    },
  });

  describe('sensor section', () => {
    describe('mechanism field', () => {
      test('valid mechanism passes', async () => {
        const validMechanisms = [
          'Apo-repressor',
          'Apo-activator',
          'Co-repressor',
          'Co-activator',
          'Signal transduction',
        ];
        for (const mechanism of validMechanisms) {
          const data = {
            sensor: {
              mechanism,
              about: '',
            },
            proteins: [createValidProtein()],
            shared: { experiment: {} },
          };
          await expect(v2_validationSchema.validate(data)).resolves.toEqual(
            expect.objectContaining({ sensor: expect.any(Object) })
          );
        }
      });

      test('invalid mechanism rejects', async () => {
        const data = {
          sensor: {
            mechanism: 'InvalidMechanism',
            about: '',
          },
          proteins: [createValidProtein()],
          shared: { experiment: {} },
        };
        try {
          await v2_validationSchema.validate(data);
          fail('Should have thrown ValidationError');
        } catch (err) {
          expect(err.errors).toContain('Invalid mechanism');
        }
      });

      test('missing mechanism rejects', async () => {
        const data = {
          sensor: {
            mechanism: '',
            about: '',
          },
          proteins: [createValidProtein()],
          shared: { experiment: {} },
        };
        try {
          await v2_validationSchema.validate(data);
          fail('Should have thrown ValidationError');
        } catch (err) {
          expect(err.errors.join(';')).toMatch(/mechanism|required/i);
        }
      });
    });

    describe('about field', () => {
      test('valid about passes', async () => {
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: 'This is a description',
          },
          proteins: [createValidProtein()],
          shared: { experiment: {} },
        };
        await expect(v2_validationSchema.validate(data)).resolves.toEqual(
          expect.objectContaining({ sensor: expect.any(Object) })
        );
      });

      test('empty about passes', async () => {
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: '',
          },
          proteins: [createValidProtein()],
          shared: { experiment: {} },
        };
        await expect(v2_validationSchema.validate(data)).resolves.toEqual(
          expect.objectContaining({ sensor: expect.any(Object) })
        );
      });

      test('about exceeding 500 chars rejects', async () => {
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: 'A'.repeat(501),
          },
          proteins: [createValidProtein()],
          shared: { experiment: {} },
        };
        try {
          await v2_validationSchema.validate(data);
          fail('Should have thrown ValidationError');
        } catch (err) {
          expect(err.errors.join(';')).toMatch(/500 characters/);
        }
      });
    });
  });

  describe('proteins array', () => {
    test('at least one protein is required', async () => {
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/At least one protein/);
      }
    });

    describe('protein fields', () => {
      test('valid protein passes', async () => {
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: '',
          },
          proteins: [createValidProtein()],
          shared: { experiment: {} },
        };
        await expect(v2_validationSchema.validate(data)).resolves.toEqual(
          expect.objectContaining({ proteins: expect.any(Array) })
        );
      });

      test('protein missing alias rejects', async () => {
        const protein = createValidProtein();
        protein.alias = '';
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: '',
          },
          proteins: [protein],
          shared: { experiment: {} },
        };
        try {
          await v2_validationSchema.validate(data);
          fail('Should have thrown ValidationError');
        } catch (err) {
          expect(err.errors.join(';')).toMatch(/alias|required|letters/i);
        }
      });

      test('protein alias exceeding 16 chars rejects', async () => {
        const protein = createValidProtein();
        protein.alias = 'ThisIsAVeryLongAlias';
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: '',
          },
          proteins: [protein],
          shared: { experiment: {} },
        };
        try {
          await v2_validationSchema.validate(data);
          fail('Should have thrown ValidationError');
        } catch (err) {
          expect(err.errors.join(';')).toMatch(/Must be 16 characters or less/);
        }
      });

      test('protein alias with invalid characters rejects', async () => {
        const protein = createValidProtein();
        protein.alias = 'TetR-001'; // hyphen not allowed
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: '',
          },
          proteins: [protein],
          shared: { experiment: {} },
        };
        try {
          await v2_validationSchema.validate(data);
          fail('Should have thrown ValidationError');
        } catch (err) {
          expect(err.errors.join(';')).toMatch(/letters or numbers/);
        }
      });

      test('protein missing uniProtID rejects', async () => {
        const protein = createValidProtein();
        protein.uniProtID = '';
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: '',
          },
          proteins: [protein],
          shared: { experiment: {} },
        };
        try {
          await v2_validationSchema.validate(data);
          fail('Should have thrown ValidationError');
        } catch (err) {
          expect(err.errors.join(';')).toContain('UniProt ID is required');
        }
      });

      test('protein accession optional when empty', async () => {
        const protein = createValidProtein();
        protein.accession = '';
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: '',
          },
          proteins: [protein],
          shared: { experiment: {} },
        };
        await expect(v2_validationSchema.validate(data)).resolves.toEqual(
          expect.objectContaining({ proteins: expect.any(Array) })
        );
      });

      test('protein accession with invalid chars rejects', async () => {
        const protein = createValidProtein();
        protein.accession = 'P0AC-U5'; // hyphen not allowed
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: '',
          },
          proteins: [protein],
          shared: { experiment: {} },
        };
        try {
          await v2_validationSchema.validate(data);
          fail('Should have thrown ValidationError');
        } catch (err) {
          expect(err.errors.join(';')).toMatch(/letters and underscores/);
        }
      });

      test('protein valid families pass', async () => {
        const validFamilies = [
          'TetR', 'LysR', 'AraC', 'MarR', 'LacI', 'GntR', 'LuxR', 'IclR', 'Other',
        ];
        for (const family of validFamilies) {
          const protein = createValidProtein();
          protein.family = family;
          const data = {
            sensor: {
              mechanism: 'Apo-repressor',
              about: '',
            },
            proteins: [protein],
            shared: { experiment: {} },
          };
          await expect(v2_validationSchema.validate(data)).resolves.toEqual(
            expect.objectContaining({ proteins: expect.any(Array) })
          );
        }
      });

      test('protein invalid family rejects', async () => {
        const protein = createValidProtein();
        protein.family = 'InvalidFamily';
        const data = {
          sensor: {
            mechanism: 'Apo-repressor',
            about: '',
          },
          proteins: [protein],
          shared: { experiment: {} },
        };
        try {
          await v2_validationSchema.validate(data);
          fail('Should have thrown ValidationError');
        } catch (err) {
          expect(err.errors).toContain('Invalid family');
        }
      });
    });
  });

  describe('ligands within protein', () => {
    test('complete ligand passes', async () => {
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [createValidProtein()],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });

    test('ligand with regulatory_effect passes', async () => {
      const protein = createValidProtein();
      protein.ligands[0].regulatory_effect = 'activates';
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });

    test('ligand with kd and kd_unit passes', async () => {
      const protein = createValidProtein();
      protein.ligands[0].kd = '100';
      protein.ligands[0].kd_unit = 'µM';
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });

    test('ligand with non-numeric kd rejects', async () => {
      const protein = createValidProtein();
      protein.ligands[0].kd = 'notanumber';
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/valid number/);
      }
    });

    test('ligand with invalid regulatory_effect rejects', async () => {
      const protein = createValidProtein();
      protein.ligands[0].regulatory_effect = 'invalid';
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/activates|represses/);
      }
    });

    test('ligand missing name when other fields set fails completeness check', async () => {
      const protein = createValidProtein();
      protein.ligands[0].name = '';
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        // Incomplete ligand triggers protein-level "needs at least one" check
        expect(err.errors.join(';')).toMatch(/stimulus or operator/i);
      }
    });
  });

  describe('operators within protein', () => {
    test('complete operator passes', async () => {
      const protein = createValidProtein();
      protein.operators = [
        {
          sequence: 'ATCG',
          doi: '10.1234/test',
          method: 'EMSA',
          fig_type: 'Figure',
          ref_figure: '1A',
          kd: '',
          kd_unit: 'nM',
        },
      ];
      protein.ligands = [];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });

    test('operator with invalid DNA sequence rejects', async () => {
      const protein = createValidProtein();
      protein.operators = [
        {
          sequence: 'ATCGX', // X not valid
          doi: '10.1234/test',
          method: 'EMSA',
          fig_type: 'Figure',
          ref_figure: '1A',
          kd: '',
          kd_unit: 'nM',
        },
      ];
      protein.ligands = [];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/sequence/i);
      }
    });
  });

  describe('light stimuli', () => {
    test('valid light stimulus passes', async () => {
      const protein = createValidProtein();
      protein.light_stimuli = [
        {
          wavelength: 450,
          regulatory_effect: 'activates',
          doi: '10.1234/test',
          method: 'EMSA',
          fig_type: 'Figure',
          ref_figure: '1A',
        },
      ];
      protein.ligands = [];
      protein.operators = [];
      protein.toggles.light = true;
      protein.toggles.ligands = false;
      protein.toggles.operators = false;
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });

    test('light stimulus missing wavelength rejects', async () => {
      const protein = createValidProtein();
      protein.light_stimuli = [
        {
          wavelength: '',
          regulatory_effect: 'activates',
          doi: '10.1234/test',
          method: 'EMSA',
          fig_type: 'Figure',
          ref_figure: '1A',
        },
      ];
      protein.ligands = [];
      protein.operators = [];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/wavelength|required|stimulus/i);
      }
    });

    test('light stimulus missing doi fails because stimulus is incomplete', async () => {
      const protein = createValidProtein();
      protein.light_stimuli = [
        {
          wavelength: 450,
          regulatory_effect: 'activates',
          doi: '',
          method: 'EMSA',
          fig_type: 'Figure',
          ref_figure: '1A',
        },
      ];
      protein.ligands = [];
      protein.operators = [];
      protein.toggles.light = true;
      protein.toggles.ligands = false;
      protein.toggles.operators = false;
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        // Missing required field in light stimulus means stimulus is incomplete
        // so form-level "needs at least one complete stimulus" error is triggered
        expect(err.errors.join(';')).toMatch(/doi|reference|stimulus/i);
      }
    });
  });

  describe('temperature stimuli', () => {
    test('valid temperature stimulus passes', async () => {
      const protein = createValidProtein();
      protein.temperature_stimuli = [
        {
          temperature: 37,
          regulatory_effect: 'activates',
          doi: '10.1234/test',
          method: 'EMSA',
          fig_type: 'Figure',
          ref_figure: '1A',
        },
      ];
      protein.ligands = [];
      protein.operators = [];
      protein.toggles.temperature = true;
      protein.toggles.ligands = false;
      protein.toggles.operators = false;
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });

    test('temperature stimulus missing temperature rejects', async () => {
      const protein = createValidProtein();
      protein.temperature_stimuli = [
        {
          temperature: '',
          regulatory_effect: 'activates',
          doi: '10.1234/test',
          method: 'EMSA',
          fig_type: 'Figure',
          ref_figure: '1A',
        },
      ];
      protein.ligands = [];
      protein.operators = [];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/temperature|required|stimulus/i);
      }
    });
  });

  describe('at-least-one-stimulus-or-operator test', () => {
    test('protein requires at least one complete stimulus or operator', async () => {
      const protein = createValidProtein();
      protein.ligands = [];
      protein.operators = [];
      protein.light_stimuli = [];
      protein.temperature_stimuli = [];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/Each protein needs at least one complete stimulus or operator/);
      }
    });

    test('empty ligand/operator arrays do not satisfy requirement', async () => {
      const protein = createValidProtein();
      protein.ligands = [
        {
          name: '',
          SMILES: '',
          doi: '',
          method: '',
          fig_type: '',
          ref_figure: '',
          regulatory_effect: '',
          kd: '',
          kd_unit: 'nM',
        },
      ];
      protein.operators = [];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/Each protein needs at least one complete stimulus or operator/);
      }
    });

    test('toggled-off sections do not block validation', async () => {
      const protein = createValidProtein();
      protein.ligands = [];
      protein.operators = [];
      protein.light_stimuli = [];
      protein.temperature_stimuli = [];
      protein.toggles.ligands = false;
      protein.toggles.operators = false;
      protein.toggles.light = false;
      protein.toggles.temperature = false;
      // With all sections toggled off, needs at least one operator or stimulus
      // So add a complete ligand back in to satisfy requirement
      protein.toggles.ligands = true;
      protein.ligands = [
        {
          name: 'TestCompound',
          SMILES: 'CC',
          doi: '10.1234/test',
          method: 'EMSA',
          fig_type: 'Figure',
          ref_figure: '1A',
          regulatory_effect: '',
          kd: '',
          kd_unit: 'nM',
        },
      ];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });
  });

  describe('two-component-only-families test', () => {
    test('OmpR and HisKA rejected for single protein', async () => {
      const protein = createValidProtein();
      protein.family = 'OmpR';
      const data = {
        sensor: {
          mechanism: 'Signal transduction',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toContain('OmpR and HisKA are only valid for two-component systems');
      }
    });

    test('OmpR and HisKA allowed for two-component systems', async () => {
      const protein1 = createValidProtein();
      protein1.family = 'OmpR';
      protein1.id = '123e4567-e89b-12d3-a456-426614174000';
      const protein2 = createValidProtein();
      protein2.id = '223e4567-e89b-12d3-a456-426614174000';
      protein2.family = 'HisKA';
      const data = {
        sensor: {
          mechanism: 'Signal transduction',
          about: '',
        },
        proteins: [protein1, protein2],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });

    test('OmpR single protein passes when not in array of 1+', async () => {
      // Actually, OmpR in any single-protein scenario should fail
      // This test confirms the rule is enforced
      const protein = createValidProtein();
      protein.family = 'HisKA';
      const data = {
        sensor: {
          mechanism: 'Signal transduction',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toContain('OmpR and HisKA are only valid for two-component systems');
      }
    });
  });

  describe('mutations within protein', () => {
    test('optional mutations array passes when empty', async () => {
      const protein = createValidProtein();
      protein.mutations = [];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });

    test('mutation with mutations and ref_id passes', async () => {
      const protein = createValidProtein();
      protein.mutations = [
        {
          mutations: 'R100K',
          ref_type: 'UniProt',
          ref_id: 'P0ACU5',
        },
      ];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      await expect(v2_validationSchema.validate(data)).resolves.toEqual(
        expect.objectContaining({ proteins: expect.any(Array) })
      );
    });

    test('mutation missing mutations when ref_id set rejects', async () => {
      const protein = createValidProtein();
      protein.mutations = [
        {
          mutations: '',
          ref_type: 'UniProt',
          ref_id: 'P0ACU5',
        },
      ];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/Mutation.*required/i);
      }
    });

    test('mutation missing ref_id when mutations set rejects', async () => {
      const protein = createValidProtein();
      protein.mutations = [
        {
          mutations: 'R100K',
          ref_type: 'UniProt',
          ref_id: '',
        },
      ];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/Reference protein ID is required/);
      }
    });

    test('mutation with invalid ref_type rejects', async () => {
      const protein = createValidProtein();
      protein.mutations = [
        {
          mutations: 'R100K',
          ref_type: 'InvalidType',
          ref_id: 'P0ACU5',
        },
      ];
      const data = {
        sensor: {
          mechanism: 'Apo-repressor',
          about: '',
        },
        proteins: [protein],
        shared: { experiment: {} },
      };
      try {
        await v2_validationSchema.validate(data);
        fail('Should have thrown ValidationError');
      } catch (err) {
        expect(err.errors.join(';')).toMatch(/reference type/i);
      }
    });
  });
});
