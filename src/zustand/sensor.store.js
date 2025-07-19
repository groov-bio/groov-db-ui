import { create } from 'zustand';
import { produce } from 'immer';

const useSensorStore = create((set) => ({
  sensorTable: {
    tetr: [],
    lysr: [],
    arac: [],
    marr: [],
    laci: [],
    gntr: [],
    luxr: [],
    iclr: [],
    other: [],
  },

  setSensorTable: (family, sensorTable) => {
    set(
      produce((draft) => {
        draft.sensorTable[family] = sensorTable;
      })
    );
  },

  sensorData: {},

  setSensorData: (uniprotID, sensorData) => {
    set(
      produce((draft) => {
        draft.sensorData[uniprotID] = sensorData;
      })
    );
  },
}));

export default useSensorStore;
