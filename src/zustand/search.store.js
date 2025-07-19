import { create } from 'zustand';
import { produce } from 'immer';

const useSearchStore = create((set) => ({
  stats: {
    regulators: 'Loading ...',
    ligands: 'Loading ...',
  },
  data: [],
  rawData: [],

  setStats: (stats) => {
    set(
      produce((draft) => {
        draft.stats = stats;
      })
    );
  },

  setData: (data) => {
    set(
      produce((draft) => {
        draft.data = data;
      })
    );
  },

  setRawData: (rawData) => {
    set(
      produce((draft) => {
        draft.rawData = rawData;
      })
    );
  },
}));

export default useSearchStore;
