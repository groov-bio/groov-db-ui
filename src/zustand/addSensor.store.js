import { create } from 'zustand';

const addSensorState = {
  about: {
    alias: '',
    accession: '',
    uniProtID: '',
    family: '',
    mechanism: '',
    about: '',
  },
  ligands: [
    {
      name: '',
      SMILES: '',
      doi: '',
      ref_figure: '',
      fig_type: '',
      method: '',
    },
  ],
  operators: [
    {
      sequence: '',
      method: '',
      ref_figure: '',
      fig_type: '',
      doi: '',
    },
  ],
  errors: {
    about: {},
    ligands: {},
    operators: {},
  },
  insertFormApi: {
    status: null,
    num: null,
    message: null,
  },
};

const ligandEntry = {
  name: '',
  SMILES: '',
  doi: '',
  ref_figure: '',
  fig_type: '',
  method: '',
};

const operatorEntry = {
  sequence: '',
  method: '',
  ref_figure: '',
  fig_type: '',
  doi: '',
};

export const useAddSensorStore = create((set, get) => ({
  ...addSensorState,

  updateField: (child, field, data) => {
    set((prevState) => ({
      ...prevState,
      [child]: {
        ...prevState[child],
        [field]: data,
      },
    }));
  },

  updateArrayField: (child, index, field, data) => {
    const currentState = get()[child];

    const updatedState = currentState.map((item, pos) => {
      if (pos === index) {
        return {
          ...item,
          [field]: data,
        };
      } else {
        return item;
      }
    });

    set((prevState) => ({
      ...prevState,
      [child]: updatedState,
    }));
  },

  addLigandEntry: () => {
    set((prevState) => ({
      ...prevState,
      ligands: [...prevState.ligands, ligandEntry],
    }));
  },

  //Super handy github post on how to do this
  //https://github.com/pmndrs/zustand/discussions/713
  removeArrayEntry: (index, type) => {
    set((prevState) => {
      const arr = [...prevState[type]];

      arr.splice(index, 1);

      return {
        ...prevState,
        [type]: arr,
      };
    });
  },

  addOperatorEntry: () => {
    set((prevState) => ({
      ...prevState,
      operators: [...prevState.operators, operatorEntry],
    }));
  },

  /**
   * This function adds a new error to error field
   * It takes in the field (about, ligands, operators)
   * And errorString, type to create a k:v
   * @param {string} field
   * @param {string} errorString
   * @param {string} type
   */
  addError: (field, errorString, type) => {
    set((prevState) => ({
      ...prevState,
      errors: {
        ...prevState.errors,
        [field]: {
          ...prevState.errors[field],
          [errorString]: type,
        },
      },
    }));
  },

  popError: (field, errorString) => {
    set((prevState) => {
      const fieldState = { ...prevState.errors[field] };

      delete fieldState[errorString];

      return {
        ...prevState,
        errors: {
          ...prevState.errors,
          [field]: fieldState,
        },
      };
    });
  },

  reset: () => {
    set(addSensorState);
  },

  updateFormApiStatus: (status, message = null) => {
    const lastNum = get()['insertFormApi']['num'];
    set((prevState) => ({
      ...prevState,
      insertFormApi: {
        ...prevState.insertFormApi,
        status: status,
        num: lastNum + 1,
        message: message,
      },
    }));
  },
}));
