import * as Yup from 'yup';
import _ from 'lodash';

const alphaNumericPattern = /^[A-Za-z0-9_.]+$/; // letters, digits + underscore
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
    pattern, // e.g. figurePattern
    validValues, // e.g. ['EMSA', 'DNase footprinting', ...]
    requiredMessage, // optional custom message
    invalidMsg, // optional custom message for pattern/validValues
  } = options;

  let schema = Yup.string().test(
    `required-if-${fieldName}`,
    requiredMessage || `${fieldName} is required if any other field is set`,
    function (value) {
      const parent = this.parent;
      // If any sibling field has a non-blank value, then this field is required
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

  // If a max length is specified, chain a max() test
  if (typeof max === 'number') {
    schema = schema.max(max, invalidMsg || `Must be ${max} characters or less`);
  }

  // If a pattern is specified, chain a custom test
  if (pattern) {
    schema = schema.test(
      `pattern-${fieldName}`,
      invalidMsg || `Invalid ${fieldName}`,
      function (value) {
        if (!value || !value.trim()) {
          return true; // Skip if blank
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

  // If a validValues array is specified, ensure the field is one of them (if not blank)
  if (Array.isArray(validValues)) {
    schema = schema.test(
      `valid-${fieldName}`,
      invalidMsg || `Invalid ${fieldName}`,
      function (value) {
        if (!value || !value.trim()) {
          return true; // Skip if blank
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

// Helper for final check
export const isCompleteEntry = (row) =>
  row &&
  !_.isEmpty(row) &&
  Object.values(row).every((val) => val && String(val).trim() !== '');

// Ligand schema
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

// Operator schema
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

const validationSchema = Yup.object()
  .shape({
    about: Yup.object().shape({
      alias: Yup.string()
        .max(16, 'Must be 16 characters or less')
        .matches(/^[A-Za-z0-9_.]+$/, 'Must contain only letters or numbers')
        .required('Alias is required'),

      accession: Yup.string()
        .matches(
          alphaNumericPattern,
          'Must contain only letters and underscores'
        )
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
    }),

    // Each array can have 0..N items, each validated by the item schema above
    ligands: Yup.array().of(ligandItemSchema),
    operators: Yup.array().of(operatorItemSchema),
  })
  .test(
    'at-least-one-complete',
    'At least one complete ligand or operator is required',
    function (values) {
      const hasCompleteLigand = values.ligands?.some(isCompleteEntry);
      const hasCompleteOperator = values.operators?.some(isCompleteEntry);

      if (!hasCompleteLigand && !hasCompleteOperator) {
        return this.createError({
          path: 'form',
          message: 'At least one complete ligand or operator is required',
        });
      }
      return true;
    }
  );

export default validationSchema;
