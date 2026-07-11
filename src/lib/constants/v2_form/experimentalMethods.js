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

// Regulatory-effect choices for stimulus entries (matches the add-sensor form).
export const regulatoryEffects = ['activates', 'represses'];

// Split a canonical ref_figure string ("Figure 3" / "Figure S3" / "Table 5" /
// "Table S5") back into a { figType, num } pair for editing. Panel suffixes like
// "4D" are kept in `num`. Inverse of joinFigure below.
export function splitFigure(refFigure) {
  const s = (refFigure ?? '').trim();
  if (/^Figure\s+S/i.test(s)) return { figType: 'Supplementary Figure', num: s.replace(/^Figure\s+S/i, '').trim() };
  if (/^Table\s+S/i.test(s)) return { figType: 'Supplementary Table', num: s.replace(/^Table\s+S/i, '').trim() };
  if (/^Table\s+/i.test(s)) return { figType: 'Table', num: s.replace(/^Table\s+/i, '').trim() };
  if (/^Figure\s+/i.test(s)) return { figType: 'Figure', num: s.replace(/^Figure\s+/i, '').trim() };
  return { figType: 'Figure', num: s };
}

// Join a figure type + number into the canonical ref_figure string the backend
// expects. Returns null when there's no number so empty rows stay empty.
export function joinFigure(figType, num) {
  const n = (num ?? '').toString().trim();
  if (!n) return null;
  switch (figType) {
    case 'Supplementary Figure':
      return `Figure S${n}`;
    case 'Table':
      return `Table ${n}`;
    case 'Supplementary Table':
      return `Table S${n}`;
    default:
      return `Figure ${n}`;
  }
}
