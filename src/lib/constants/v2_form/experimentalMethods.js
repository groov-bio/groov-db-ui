/**
 * Shared option lists for experimental-evidence fields, used by both the
 * add-sensor form (Formik) and the edit-sensor form (immer/useState). Keep this
 * as the single source of truth so the two forms always offer the same choices.
 */

export const ligandMethods = [
  'EMSA', 'DNase footprinting', 'Isothermal titration calorimetry',
  'Surface plasmon resonance', 'Synthetic regulation', 'Fluorescence polarization',
  'Thermal shift', 'Spectrophotometric competition', 'Spectral shift',
  'DNA affinity chromatography', 'Autophosphorylation assay',
];

export const operatorMethods = [
  'EMSA', 'DNase footprinting', 'Surface plasmon resonance', 'Crystal structure',
  'Isothermal titration calorimetry', 'Fluorescence polarization',
  'Synthetic regulation', 'ChIP-Seq',
];

export const figureTypes = ['Figure', 'Supplementary Figure', 'Table', 'Supplementary Table'];
