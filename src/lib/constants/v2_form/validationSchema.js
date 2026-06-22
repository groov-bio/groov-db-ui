import * as Yup from 'yup';
import _ from 'lodash';

const alphaNumericPattern = /^[A-Za-z0-9_.]+$/;
const dnaSequencePattern = /^[ATCGatcg]+$/;
const figurePattern = /^[S]?[1-9]?[0-9A-Za-z]?$/;
const doiValidation =
  /^(https?:\/\/doi\.org\/|doi:|doi\.org\/)?(10.\d{4,9}[-._;()/:A-Z0-9]+)$/i;

const ligandMethods = [
  'EMSA',
  'DNase footprinting',
  'Isothermal titration calorimetry',
  'Surface plasmon resonance',
  'Fluorescence polarization',
  'Synthetic regulation',
  'Thermal shift',
  'Spectrophotometric competition',
  'Spectral shift',
  'DNA affinity chromatography',
  'Autophosphorylation assay',
];

const operatorMethods = [
  'EMSA',
  'DNase footprinting',
  'Surface plasmon resonance',
  'Crystal structure',
  'Isothermal titration calorimetry',
  'Fluorescence polarization',
  'Synthetic regulation',
  'ChIP-Seq',
];

const figureTypes = [
  'Figure',
  'Supplementary Figure',
  'Table',
  'Supplementary Table',
];

const kdUnitValues = ['nM', 'µM', 'mM'];

const mechanismValues = [
  'Apo-repressor',
  'Apo-activator',
  'Co-repressor',
  'Co-activator',
  // Multi-component (two-component) systems — auto-selected when 2+ proteins.
  'Signal transduction',
];

const baseFamilyValues = ['TetR', 'LysR', 'AraC', 'MarR', 'LacI', 'GntR', 'LuxR', 'IclR', 'Other'];
// OmpR and HisKA are structural families for the individual proteins that make
// up a two-component system. A lone protein in one of these families is an
// incomplete entry, so they're only valid when the sensor has 2+ proteins
// (enforced by the `two-component-only-families` test below).
const twoComponentFamilyValues = ['OmpR', 'HisKA'];
const familyValues = [...baseFamilyValues, ...twoComponentFamilyValues];

function conditionallyRequiredString(options) {
  const {
    fieldName,
    otherFields = [],
    max,
    pattern,
    validValues,
    requiredMessage,
    invalidMsg,
  } = options;

  let schema = Yup.string().test(
    `required-if-${fieldName}`,
    requiredMessage || `${fieldName} is required if any other field is set`,
    function (value) {
      const parent = this.parent;
      const anySiblingSet = otherFields.some((field) => {
        const val = parent[field];
        return val && String(val).trim() !== '';
      });
      if (anySiblingSet && (!value || !String(value).trim())) {
        return this.createError({
          message:
            requiredMessage ||
            `${fieldName} is required if any other field is set`,
        });
      }
      return true;
    }
  );

  if (typeof max === 'number') {
    schema = schema.max(max, invalidMsg || `Must be ${max} characters or less`);
  }

  if (pattern) {
    schema = schema.test(
      `pattern-${fieldName}`,
      invalidMsg || `Invalid ${fieldName}`,
      function (value) {
        if (!value || !value.trim()) return true;
        if (!pattern.test(value)) {
          return this.createError({
            message: invalidMsg || `Invalid ${fieldName}`,
          });
        }
        return true;
      }
    );
  }

  if (Array.isArray(validValues)) {
    schema = schema.test(
      `valid-${fieldName}`,
      invalidMsg || `Invalid ${fieldName}`,
      function (value) {
        if (!value || !value.trim()) return true;
        if (!validValues.includes(value)) {
          return this.createError({
            message: invalidMsg || `Invalid ${fieldName}`,
          });
        }
        return true;
      }
    );
  }

  return schema;
}

export const isCompleteEntry = (row) => {
  if (!row || _.isEmpty(row)) return false;
  // Optional fields don't count toward "completeness". Yup casts strip
  // undefined values before this runs, so a row with only an optional default
  // (e.g. {kd_unit: 'nM'}) must NOT be treated as complete.
  const required = Object.entries(row).filter(
    ([k]) => !['regulatory_effect', 'kd', 'kd_unit', 'fig_type'].includes(k)
  );
  if (required.length === 0) return false;
  return required.every(
    ([, val]) => val !== undefined && val !== null && String(val).trim() !== ''
  );
};

const optionalNumber = Yup.mixed().test(
  'optional-number',
  'Must be a valid number',
  (value) => {
    if (value === '' || value === null || value === undefined) return true;
    return !Number.isNaN(Number(value));
  }
);

const ligandItemSchema = Yup.object().shape({
  name: conditionallyRequiredString({
    fieldName: 'name',
    otherFields: ['SMILES', 'doi', 'method', 'ref_figure', 'fig_type'],
    max: 64,
    requiredMessage: 'Name is required',
  }),
  SMILES: conditionallyRequiredString({
    fieldName: 'SMILES',
    otherFields: ['name', 'doi', 'method', 'ref_figure', 'fig_type'],
    requiredMessage: 'SMILES string is required',
  }),
  doi: conditionallyRequiredString({
    fieldName: 'doi',
    otherFields: ['name', 'SMILES', 'method', 'ref_figure', 'fig_type'],
    requiredMessage: 'DOI reference is required',
    pattern: doiValidation,
  }),
  method: conditionallyRequiredString({
    fieldName: 'method',
    otherFields: ['name', 'SMILES', 'doi', 'ref_figure', 'fig_type'],
    validValues: ligandMethods,
    requiredMessage: 'Method selection is required',
  }),
  fig_type: conditionallyRequiredString({
    fieldName: 'fig_type',
    otherFields: ['name', 'SMILES', 'doi', 'method', 'ref_figure'],
    validValues: figureTypes,
    requiredMessage: 'Figure selection is required',
  }),
  ref_figure: conditionallyRequiredString({
    fieldName: 'ref_figure',
    otherFields: ['name', 'SMILES', 'doi', 'method', 'fig_type'],
    pattern: figurePattern,
    requiredMessage: 'Reference figure is required',
  }),
  regulatory_effect: Yup.string().oneOf(['activates', 'represses', ''], 'Must be "activates" or "represses"').notRequired(),
  kd: optionalNumber,
  kd_unit: Yup.string().oneOf(kdUnitValues, 'Invalid Kd unit').notRequired(),
});

const operatorItemSchema = Yup.object().shape({
  sequence: conditionallyRequiredString({
    fieldName: 'sequence',
    otherFields: ['doi', 'method', 'ref_figure', 'fig_type'],
    max: 512,
    pattern: dnaSequencePattern,
    requiredMessage: 'DNA sequence is required',
  }),
  doi: conditionallyRequiredString({
    fieldName: 'doi',
    otherFields: ['sequence', 'method', 'ref_figure', 'fig_type'],
    requiredMessage: 'DOI reference is required',
    pattern: doiValidation,
  }),
  method: conditionallyRequiredString({
    fieldName: 'method',
    otherFields: ['sequence', 'doi', 'ref_figure', 'fig_type'],
    validValues: operatorMethods,
    requiredMessage: 'Method selection is required',
  }),
  fig_type: conditionallyRequiredString({
    fieldName: 'fig_type',
    otherFields: ['sequence', 'doi', 'method', 'ref_figure'],
    validValues: figureTypes,
    requiredMessage: 'Figure selection is required',
  }),
  ref_figure: conditionallyRequiredString({
    fieldName: 'ref_figure',
    otherFields: ['sequence', 'doi', 'method', 'fig_type'],
    pattern: figurePattern,
    requiredMessage: 'Reference figure is required',
  }),
  kd: optionalNumber,
  kd_unit: Yup.string().oneOf(kdUnitValues, 'Invalid Kd unit').notRequired(),
});

// Light/temperature entries only exist when the user toggles the section on, so
// every field is required for a present entry (DOI, figure, and method included
// — they reference the same evidence we require for ligands/operators).
const lightStimulusSchema = Yup.object().shape({
  wavelength: Yup.number().typeError('Wavelength is required').required('Wavelength is required'),
  regulatory_effect: Yup.string().oneOf(['activates', 'represses', ''], 'Must be "activates" or "represses"').notRequired(),
  doi: Yup.string().required('DOI reference is required').matches(doiValidation, { message: 'Invalid DOI', excludeEmptyString: true }),
  method: Yup.string().required('Method is required'),
  fig_type: Yup.string().oneOf(figureTypes, 'Invalid figure type').required('Figure type is required'),
  ref_figure: Yup.string().required('Figure number is required').matches(figurePattern, { message: 'Invalid figure', excludeEmptyString: true }),
});

const temperatureStimulusSchema = Yup.object().shape({
  temperature: Yup.number().typeError('Temperature is required').required('Temperature is required'),
  regulatory_effect: Yup.string().oneOf(['activates', 'represses', ''], 'Must be "activates" or "represses"').notRequired(),
  doi: Yup.string().required('DOI reference is required').matches(doiValidation, { message: 'Invalid DOI', excludeEmptyString: true }),
  method: Yup.string().required('Method is required'),
  fig_type: Yup.string().oneOf(figureTypes, 'Invalid figure type').required('Figure type is required'),
  ref_figure: Yup.string().required('Figure number is required').matches(figurePattern, { message: 'Invalid figure', excludeEmptyString: true }),
});

const proteinSchema = Yup.object()
  .shape({
    id: Yup.string().required(),
    alias: Yup.string()
      .max(16, 'Must be 16 characters or less')
      .matches(/^[A-Za-z0-9_.]+$/, 'Must contain only letters or numbers')
      .required('Alias is required'),
    // Optional (item 7): mutant / engineered proteins legitimately lack a
    // UniProt or RefSeq ID. The pattern still applies when a value is given,
    // but an empty field is allowed.
    accession: Yup.string()
      .matches(alphaNumericPattern, {
        message: 'Must contain only letters and underscores',
        excludeEmptyString: true,
      })
      .notRequired(),
    uniProtID: Yup.string()
      .matches(alphaNumericPattern, {
        message: 'Must contain only letters, numbers, and underscores',
        excludeEmptyString: true,
      })
      .notRequired(),
    family: Yup.string()
      .oneOf(familyValues, 'Invalid family')
      .required('Family is required'),
    ligands: Yup.array().of(ligandItemSchema),
    operators: Yup.array().of(operatorItemSchema),
    light_stimuli: Yup.array().of(lightStimulusSchema),
    temperature_stimuli: Yup.array().of(temperatureStimulusSchema),
    toggles: Yup.object().shape({
      ligands: Yup.boolean(),
      operators: Yup.boolean(),
      light: Yup.boolean(),
      temperature: Yup.boolean(),
    }).notRequired(),
    mutations: Yup.array().of(
      Yup.object().shape({
        mutations: conditionallyRequiredString({
          fieldName: 'mutations',
          otherFields: ['ref_id'],
          requiredMessage: 'Mutation(s) required when a reference is provided',
        }),
        ref_type: Yup.string().oneOf(['UniProt', 'groovDB', ''], 'Invalid reference type').notRequired(),
        ref_id: conditionallyRequiredString({
          fieldName: 'ref_id',
          otherFields: ['mutations'],
          requiredMessage: 'Reference protein ID is required',
        }),
      })
    ),
  })
  .test(
    'at-least-one-stimulus-or-operator',
    'At least one complete ligand, operator, or alternative stimulus is required',
    function (protein) {
      // Toggled-off sections have their arrays cleared, so the array length
      // check is sufficient — but we also guard explicitly via toggles so that
      // a section disabled by the user never fails the "needs entries" rule.
      const toggles = protein.toggles ?? {};
      const hasLigand =
        toggles.ligands !== false && protein.ligands?.some(isCompleteEntry);
      const hasOperator =
        toggles.operators !== false && protein.operators?.some(isCompleteEntry);
      const hasLight =
        toggles.light !== false &&
        protein.light_stimuli?.some(
          (s) => s?.wavelength !== '' && s?.wavelength != null
        );
      const hasTemp =
        toggles.temperature !== false &&
        protein.temperature_stimuli?.some(
          (s) => s?.temperature !== '' && s?.temperature != null
        );
      if (!hasLigand && !hasOperator && !hasLight && !hasTemp) {
        return this.createError({
          path: `${this.path}.form`,
          message:
            'Each protein needs at least one complete stimulus or operator',
        });
      }
      return true;
    }
  );

const sensorSchema = Yup.object().shape({
  mechanism: Yup.string()
    .oneOf(mechanismValues, 'Invalid mechanism')
    .required('Mechanism is required'),
  about: Yup.string().max(500, 'Must be 500 characters or less').notRequired(),
});

const sharedExperimentSchema = Yup.object().shape({
  // Placeholder
});

export const v2_validationSchema = Yup.object()
  .shape({
    sensor: sensorSchema,
    shared: Yup.object().shape({
      experiment: sharedExperimentSchema,
    }),
    proteins: Yup.array()
      .of(proteinSchema)
      .min(1, 'At least one protein is required')
      .required('Proteins array is required'),
  })
  // OmpR/HisKA only make sense for a two-component system, so a single-protein
  // submission can't use them. The error is attached to the offending protein's
  // family field so it surfaces inline on the About tab.
  .test(
    'two-component-only-families',
    'OmpR and HisKA are only valid for two-component systems',
    function (value) {
      const proteins = value?.proteins ?? [];
      if (proteins.length >= 2) return true;
      const offenderIndex = proteins.findIndex((p) =>
        twoComponentFamilyValues.includes(p?.family)
      );
      if (offenderIndex === -1) return true;
      return this.createError({
        path: `proteins[${offenderIndex}].family`,
        message:
          'OmpR and HisKA are only valid for two-component systems — add a second protein',
      });
    }
  );

export default v2_validationSchema;
