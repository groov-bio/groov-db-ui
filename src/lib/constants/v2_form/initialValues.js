/**
 * V2 Form Initial Values — Sensor-as-Container model
 *
 * A submission represents ONE sensor that contains N proteins (typically 1, or 2
 * for two-component systems). Sensor-level fields (category, about) live at the
 * top; protein-level fields (alias, uniProtID, ligands, operators, stimuli,
 * mutations, etc.) live inside each entry of `proteins[]`.
 */

export const createEmptyLigand = () => ({
  name: '',
  SMILES: '',
  doi: '',
  ref_figure: '',
  fig_type: '',
  method: '',
  regulatory_effect: '',
  kd: '',
});

export const createEmptyOperator = () => ({
  sequence: '',
  method: '',
  ref_figure: '',
  fig_type: '',
  doi: '',
  kd: '',
});

export const createEmptyLightStimulus = () => ({
  wavelength: '',
  regulatory_effect: '',
  doi: '',
  method: '',
  ref_figure: '',
  fig_type: '',
});

export const createEmptyTemperatureStimulus = () => ({
  temperature: '',
  regulatory_effect: '',
  doi: '',
  method: '',
  ref_figure: '',
  fig_type: '',
});

export const createEmptyProtein = () => ({
  id: crypto.randomUUID(),
  alias: '',
  uniProtID: '',
  accession: '',
  mechanism: '',
  ligands: [createEmptyLigand()],
  operators: [createEmptyOperator()],
  light_stimuli: [],
  temperature_stimuli: [],
  mutations: [],
});

export const createEmptySensor = () => ({
  category: '',
  about: '',
});

export const createEmptySharedExperiment = () => ({
  // Placeholder for future shared experiment fields
});

export const v2_initialValues = {
  sensor: createEmptySensor(),
  proteins: [createEmptyProtein()],
  shared: {
    experiment: createEmptySharedExperiment(),
  },
};

export const getInitialValuesWithProteins = (count = 1) => ({
  sensor: createEmptySensor(),
  proteins: Array.from({ length: count }, () => createEmptyProtein()),
  shared: {
    experiment: createEmptySharedExperiment(),
  },
});
