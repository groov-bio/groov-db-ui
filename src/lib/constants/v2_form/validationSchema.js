import * as Yup from 'yup';
import _ from 'lodash';

// TODO - expand this and eventually deprecate v1

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
];

const operatorMethods = [
  'EMSA',
  'DNase footprinting',
  'Surface plasmon resonance',
  'Crystal structure',
  'Isothermal titration calorimetry',
  'Fluorescence polarization',
  'Synthetic regulation',
];

const figureTypes = [
  'Figure',
  'Supplementary Figure',
  'Table',
  'Supplementary Table',
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
        return val && val.trim() !== '';
      });
      if (anySiblingSet && (!value || !value.trim())) {
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
        if (!value || !value.trim()) {
          return true;
        }
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
        if (!value || !value.trim()) {
          return true;
        }
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
  Object.values(row).every((val) => val && String(val).trim() !== '');

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
});

/**
 * Operator item schema (copied from v1)
 */
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
});

/**
 * About section schema (copied from v1)
 */
const aboutSchema = Yup.object().shape({
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

  family: Yup.string()
    .oneOf(
      [
        'TetR',
        'LysR',
        'AraC',
        'MarR',
        'LacI',
        'GntR',
        'LuxR',
        'IclR',
        'Other',
      ],
      'Invalid family'
    )
    .required('Family is required'),
});

const stimulusSchema = Yup.object().shape({
  // Placeholder - add validation rules as fields are added
});

const proteinSchema = Yup.object()
  .shape({
    id: Yup.string().required(),
    about: aboutSchema,
    ligands: Yup.array().of(ligandItemSchema),
    operators: Yup.array().of(operatorItemSchema),
    stimulus: stimulusSchema,
  })
  .test(
    'at-least-one-complete',
    'At least one complete ligand or operator is required',
    function (protein) {
      const hasCompleteLigand = protein.ligands?.some(isCompleteEntry);
      const hasCompleteOperator = protein.operators?.some(isCompleteEntry);

      if (!hasCompleteLigand && !hasCompleteOperator) {
        return this.createError({
          path: `${this.path}.form`,
          message: 'At least one complete ligand or operator is required for this protein',
        });
      }
      return true;
    }
  );

const sharedExperimentSchema = Yup.object().shape({
  // Placeholder - add validation rules as fields are added
});

export const v2_validationSchema = Yup.object().shape({
  shared: Yup.object().shape({
    experiment: sharedExperimentSchema,
  }),
  proteins: Yup.array()
    .of(proteinSchema)
    .min(1, 'At least one protein is required')
    .required('Proteins array is required'),
});

export default v2_validationSchema;
