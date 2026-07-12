import useV2SensorTableStore from '../../zustand/v2SensorTable.store';
import { waitFor } from '../../test-utils';

describe('useV2SensorTableStore', () => {
  beforeEach(() => {
    useV2SensorTableStore.setState({
      tables: {
        all: null,
        tetr: null,
        lysr: null,
        arac: null,
        marr: null,
        laci: null,
        gntr: null,
        luxr: null,
        iclr: null,
        other: null,
        dual: null,
      },
      loading: {
        all: false,
        tetr: false,
        lysr: false,
        arac: false,
        marr: false,
        laci: false,
        gntr: false,
        luxr: false,
        iclr: false,
        other: false,
        dual: false,
      },
    });
    jest.restoreAllMocks();
  });

  describe('initialization', () => {
    test('initializes all table keys as null', () => {
      const state = useV2SensorTableStore.getState();
      expect(state.tables.all).toBeNull();
      expect(state.tables.tetr).toBeNull();
      expect(state.tables.lysr).toBeNull();
      expect(state.tables.dual).toBeNull();
    });

    test('initializes all loading states as false', () => {
      const state = useV2SensorTableStore.getState();
      expect(state.loading.all).toBe(false);
      expect(state.loading.tetr).toBe(false);
      expect(state.loading.dual).toBe(false);
    });
  });

  describe('fetchTable with successful response', () => {
    test('fetches data with "sensors" key and populates table', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              sensors: [
                { id: '1', name: 'Sensor1' },
                { id: '2', name: 'Sensor2' },
              ],
            }),
        })
      );

      useV2SensorTableStore.getState().fetchTable('tetr', 'https://api.example.com/tetr');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().tables.tetr).toEqual([
          { id: '1', name: 'Sensor1' },
          { id: '2', name: 'Sensor2' },
        ]);
      });

      expect(useV2SensorTableStore.getState().loading.tetr).toBe(false);
    });

    test('fetches data with "data" key and populates table', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              data: [{ id: '1', name: 'Sensor1' }],
            }),
        })
      );

      useV2SensorTableStore.getState().fetchTable('lysr', 'https://api.example.com/lysr');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().tables.lysr).toEqual([
          { id: '1', name: 'Sensor1' },
        ]);
      });
    });

    test('uses direct data array when neither "sensors" nor "data" key exists', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { id: '1', name: 'DirectSensor1' },
              { id: '2', name: 'DirectSensor2' },
            ]),
        })
      );

      useV2SensorTableStore.getState().fetchTable('arac', 'https://api.example.com/arac');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().tables.arac).toEqual([
          { id: '1', name: 'DirectSensor1' },
          { id: '2', name: 'DirectSensor2' },
        ]);
      });
    });

    test('converts non-array response to empty array', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sensors: 'not an array' }),
        })
      );

      useV2SensorTableStore.getState().fetchTable('marr', 'https://api.example.com/marr');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().tables.marr).toEqual([]);
      });
    });

    test('sets loading to false after successful fetch', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sensors: [{ id: '1' }] }),
        })
      );

      useV2SensorTableStore.getState().fetchTable('laci', 'https://api.example.com/laci');

      expect(useV2SensorTableStore.getState().loading.laci).toBe(true);

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().loading.laci).toBe(false);
      });
    });

    test('calls fetch with correct URL and headers', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sensors: [] }),
        })
      );

      const testUrl = 'https://api.example.com/gntr';
      useV2SensorTableStore.getState().fetchTable('gntr', testUrl);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(testUrl, {
          headers: { Accept: 'application/json' },
        });
      });
    });
  });

  describe('fetchTable guard logic', () => {
    test('does not fetch if table is already populated (not null)', async () => {
      global.fetch = jest.fn();

      // Set initial state with existing data
      const initialState = useV2SensorTableStore.getState();
      initialState.tables.luxr = [{ id: '1', name: 'ExistingData' }];
      useV2SensorTableStore.setState({ tables: initialState.tables });

      useV2SensorTableStore.getState().fetchTable('luxr', 'https://api.example.com/luxr');

      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('does not fetch if already loading', async () => {
      global.fetch = jest.fn();

      // Set initial state with loading true
      const initialState = useV2SensorTableStore.getState();
      initialState.loading.iclr = true;
      useV2SensorTableStore.setState({ loading: initialState.loading });

      useV2SensorTableStore.getState().fetchTable('iclr', 'https://api.example.com/iclr');

      expect(global.fetch).not.toHaveBeenCalled();
    });

    test('does fetch if table is null and not currently loading', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sensors: [] }),
        })
      );

      useV2SensorTableStore.getState().fetchTable('other', 'https://api.example.com/other');

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });
  });

  describe('fetchTable error handling', () => {
    test('handles HTTP error response', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: () => Promise.resolve({}),
        })
      );

      jest.spyOn(console, 'error').mockImplementation(() => {});

      useV2SensorTableStore.getState().fetchTable('dual', 'https://api.example.com/dual');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().loading.dual).toBe(false);
      });

      expect(useV2SensorTableStore.getState().tables.dual).toBeNull();
      expect(console.error).toHaveBeenCalled();

      console.error.mockRestore();
    });

    test('handles network error (rejected fetch)', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

      jest.spyOn(console, 'error').mockImplementation(() => {});

      useV2SensorTableStore.getState().fetchTable('all', 'https://api.example.com/all');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().loading.all).toBe(false);
      });

      expect(useV2SensorTableStore.getState().tables.all).toBeNull();
      expect(console.error).toHaveBeenCalled();

      console.error.mockRestore();
    });

    test('sets loading to false on error', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Fetch failed'))
      );

      jest.spyOn(console, 'error').mockImplementation(() => {});

      useV2SensorTableStore.getState().fetchTable('tetr', 'https://api.example.com/tetr');

      expect(useV2SensorTableStore.getState().loading.tetr).toBe(true);

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().loading.tetr).toBe(false);
      });

      console.error.mockRestore();
    });

    test('does not overwrite table data on error', async () => {
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('Fetch failed'))
      );

      jest.spyOn(console, 'error').mockImplementation(() => {});

      const initialState = useV2SensorTableStore.getState();
      initialState.tables.lysr = null;
      useV2SensorTableStore.setState({ tables: initialState.tables });

      useV2SensorTableStore.getState().fetchTable('lysr', 'https://api.example.com/lysr');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().tables.lysr).toBeNull();
      });

      console.error.mockRestore();
    });
  });

  describe('multiple concurrent fetches', () => {
    test('can fetch different families independently', async () => {
      global.fetch = jest.fn((url) => {
        const key = url.split('/').pop();
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              sensors: [{ id: key, name: `Sensor ${key}` }],
            }),
        });
      });

      useV2SensorTableStore.getState().fetchTable('tetr', 'https://api.example.com/tetr');
      useV2SensorTableStore.getState().fetchTable('lysr', 'https://api.example.com/lysr');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().tables.tetr).toEqual([
          { id: 'tetr', name: 'Sensor tetr' },
        ]);
        expect(useV2SensorTableStore.getState().tables.lysr).toEqual([
          { id: 'lysr', name: 'Sensor lysr' },
        ]);
      });
    });

    test('maintains independent loading states', async () => {
      global.fetch = jest.fn((url) => {
        const key = url.split('/').pop();
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sensors: [{ id: key }] }),
        });
      });

      useV2SensorTableStore.getState().fetchTable('arac', 'https://api.example.com/arac');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().loading.arac).toBe(false);
      });

      expect(useV2SensorTableStore.getState().loading.marr).toBe(false);
    });
  });

  describe('empty response handling', () => {
    test('handles empty sensors array', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ sensors: [] }),
        })
      );

      useV2SensorTableStore.getState().fetchTable('marr', 'https://api.example.com/marr');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().tables.marr).toEqual([]);
      });
    });

    test('handles empty data array', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: [] }),
        })
      );

      useV2SensorTableStore.getState().fetchTable('laci', 'https://api.example.com/laci');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().tables.laci).toEqual([]);
      });
    });

    test('handles null response', async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(null),
        })
      );

      jest.spyOn(console, 'error').mockImplementation(() => {});

      useV2SensorTableStore.getState().fetchTable('gntr', 'https://api.example.com/gntr');

      await waitFor(() => {
        expect(useV2SensorTableStore.getState().loading.gntr).toBe(false);
      });

      // When response is null, accessing data['sensors'] throws an error,
      // so the table remains null and loading is set to false
      expect(useV2SensorTableStore.getState().tables.gntr).toBeNull();
      expect(console.error).toHaveBeenCalled();

      console.error.mockRestore();
    });
  });
});
