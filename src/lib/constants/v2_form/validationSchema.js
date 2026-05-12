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
];

const categoryValues = [
  'TetR',
  'LysR',
  'AraC',
  'MarR',
  'LacI',
  'GntR',
  'LuxR',
  'IclR',
  'Other',
];

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

export const isCompleteEntry = (row) =>
  row &&
  !_.isEmpty(row) &&
  Object.entries(row)
    // optional fields don't count toward "completeness"
    .filter(([k]) => !['regulatory_effect', 'kd', 'fig_type'].includes(k))
    .every(([, val]) => val !== undefined && val !== null && String(val).trim() !== '');

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
  regulatory_effect: Yup.string().notRequired(),
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

const lightStimulusSchema = Yup.object().shape({
  wavelength: optionalNumber,
  regulatory_effect: Yup.string().notRequired(),
  doi: Yup.string().matches(doiValidation, { message: 'Invalid DOI', excludeEmptyString: true }),
  method: Yup.string().notRequired(),
  ref_figure: Yup.string().matches(figurePattern, { message: 'Invalid figure', excludeEmptyString: true }),
  fig_type: Yup.string().oneOf([...figureTypes, ''], 'Invalid figure type'),
});

const temperatureStimulusSchema = Yup.object().shape({
  temperature: optionalNumber,
  regulatory_effect: Yup.string().notRequired(),
  doi: Yup.string().matches(doiValidation, { message: 'Invalid DOI', excludeEmptyString: true }),
  method: Yup.string().notRequired(),
  ref_figure: Yup.string().matches(figurePattern, { message: 'Invalid figure', excludeEmptyString: true }),
  fig_type: Yup.string().oneOf([...figureTypes, ''], 'Invalid figure type'),
});

const proteinSchema = Yup.object()
  .shape({
    id: Yup.string().required(),
    alias: Yup.string()
      .max(16, 'Must be 16 characters or less')
      .matches(/^[A-Za-z0-9_.]+$/, 'Must contain only letters or numbers')
      .required('Alias is required'),
    accession: Yup.string()
      .matches(alphaNumericPattern, 'Must contain only letters and underscores')
      .required('Accession is required'),
    uniProtID: Yup.string()
      .matches(
        alphaNumericPattern,
        'Must contain only letters, numbers, and underscores'
      )
      .required('UniProtID is required'),
    mechanism: Yup.string()
      .oneOf(mechanismValues, 'Invalid mechanism')
      .required('Mechanism is required'),
    ligands: Yup.array().of(ligandItemSchema),
    operators: Yup.array().of(operatorItemSchema),
    light_stimuli: Yup.array().of(lightStimulusSchema),
    temperature_stimuli: Yup.array().of(temperatureStimulusSchema),
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
      const hasLigand = protein.ligands?.some(isCompleteEntry);
      const hasOperator = protein.operators?.some(isCompleteEntry);
      const hasLight = protein.light_stimuli?.some(
        (s) => s?.wavelength !== '' && s?.wavelength != null
      );
      const hasTemp = protein.temperature_stimuli?.some(
        (s) => s?.temperature !== '' && s?.temperature != null
      );
      if (!hasLigand && !hasOperator && !hasLight && !hasTemp) {
        return this.createError({
          path: `${this.path}.form`,
          message:
            'Each protein needs at least one complete ligand, operator, light, or temperature entry',
        });
      }
      return true;
    }
  );

const sensorSchema = Yup.object().shape({
  category: Yup.string()
    .oneOf(categoryValues, 'Invalid category')
    .required('Category is required'),
  about: Yup.string().max(500, 'Must be 500 characters or less').notRequired(),
});

const sharedExperimentSchema = Yup.object().shape({
  // Placeholder
});

export const v2_validationSchema = Yup.object().shape({
  sensor: sensorSchema,
  shared: Yup.object().shape({
    experiment: sharedExperimentSchema,
  }),
  proteins: Yup.array()
    .of(proteinSchema)
    .min(1, 'At least one protein is required')
    .required('Proteins array is required'),
});

export default v2_validationSchema;
