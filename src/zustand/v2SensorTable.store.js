import { create } from 'zustand';
import { produce } from 'immer';

const FAMILY_KEYS = ['all', 'tetr', 'lysr', 'arac', 'marr', 'laci', 'gntr', 'luxr', 'iclr', 'other', 'dual'];

const useV2SensorTableStore = create((set, get) => ({
  tables: Object.fromEntries(FAMILY_KEYS.map((k) => [k, null])), // null = not fetched
  loading: Object.fromEntries(FAMILY_KEYS.map((k) => [k, false])),

  fetchTable: (key, url) => {
    const { tables, loading } = get();
    if (tables[key] !== null || loading[key]) return;

    set(produce((draft) => { draft.loading[key] = true; }));

    fetch(url, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // index.json uses 'sensors'; family endpoints use 'data'
        const sensors = data['sensors'] ?? data['data'] ?? data;
        set(produce((draft) => {
          draft.tables[key] = Array.isArray(sensors) ? sensors : [];
          draft.loading[key] = false;
        }));
      })
      .catch((err) => {
        console.error(`Error fetching v2 sensor table [${key}]:`, err);
        set(produce((draft) => { draft.loading[key] = false; }));
      });
  },
}));

export default useV2SensorTableStore;
