/**
 * V2 Form Initial Values - Multi-protein Support
 *
 * This file provides factory functions for creating initial values
 * for the v2 form that supports multiple proteins.
 *
 * Structure:
 * - shared: Fields that apply to all proteins (e.g., experiment metadata)
 * - proteins: Array of protein entries, each with about/ligands/operators/stimulus
 */

/**
 * Creates an empty ligand entry
 * @returns {Object} Empty ligand object
 */
export const createEmptyLigand = () => ({
  name: '',
  SMILES: '',
  doi: '',
  ref_figure: '',
  fig_type: '',
  method: '',
});

/**
 * Creates an empty operator entry
 * @returns {Object} Empty operator object
 */
export const createEmptyOperator = () => ({
  sequence: '',
  method: '',
  ref_figure: '',
  fig_type: '',
  doi: '',
});

/**
 * Creates an empty stimulus entry (placeholder for future expansion)
 * @returns {Object} Empty stimulus object
 */
export const createEmptyStimulus = () => ({
  // Placeholder for future stimulus fields
  // Example: temperature: '', pH: '', concentration: '', etc.
});

/**
 * Creates an empty protein entry with all sections
 * @returns {Object} Empty protein object with unique ID
 */
export const createEmptyProtein = () => ({
  id: crypto.randomUUID(), // Unique identifier for each protein
  about: {
    alias: '',
    accession: '',
    uniProtID: '',
    family: '',
    mechanism: '',
    about: '',
  },
  ligands: [createEmptyLigand()],
  operators: [createEmptyOperator()],
  stimulus: createEmptyStimulus(),
});

/**
 * Creates empty shared experiment data (placeholder for future expansion)
 * @returns {Object} Empty shared experiment object
 */
export const createEmptySharedExperiment = () => ({
  // Placeholder for future shared experiment fields
  // Example: date: '', researcher: '', lab: '', notes: '', etc.
});

/**
 * V2 Form initial values - supports multiple proteins
 * Starts with one protein by default
 */
export const v2_initialValues = {
  shared: {
    experiment: createEmptySharedExperiment(),
  },
  proteins: [createEmptyProtein()],
};

/**
 * Helper function to get initial values with N proteins
 * @param {number} count - Number of proteins to initialize
 * @returns {Object} Initial values with N proteins
 */
export const getInitialValuesWithProteins = (count = 1) => ({
  shared: {
    experiment: createEmptySharedExperiment(),
  },
  proteins: Array.from({ length: count }, () => createEmptyProtein()),
});
