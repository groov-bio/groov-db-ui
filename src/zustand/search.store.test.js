import useSearchStore from './search.store';

describe('useSearchStore', () => {
  beforeEach(() => {
    useSearchStore.setState({
      stats: {
        regulators: 'Loading ...',
        ligands: 'Loading ...',
      },
      data: [],
      rawData: [],
    });
  });

  test('initializes with default stats', () => {
    const state = useSearchStore.getState();
    expect(state.stats).toEqual({
      regulators: 'Loading ...',
      ligands: 'Loading ...',
    });
  });

  test('initializes with empty data arrays', () => {
    const state = useSearchStore.getState();
    expect(state.data).toEqual([]);
    expect(state.rawData).toEqual([]);
  });

  test('setStats updates the stats state', () => {
    const newStats = { regulators: 100, ligands: 50 };
    useSearchStore.getState().setStats(newStats);

    const updatedState = useSearchStore.getState();
    expect(updatedState.stats).toEqual(newStats);
  });

  test('setStats replaces previous stats completely', () => {
    const stats1 = { regulators: 100, ligands: 50 };
    const stats2 = { regulators: 200, ligands: 75 };

    useSearchStore.getState().setStats(stats1);
    expect(useSearchStore.getState().stats).toEqual(stats1);

    useSearchStore.getState().setStats(stats2);
    expect(useSearchStore.getState().stats).toEqual(stats2);
  });

  test('setData updates the data array', () => {
    const testData = [
      { id: 1, name: 'Sensor1' },
      { id: 2, name: 'Sensor2' },
    ];
    useSearchStore.getState().setData(testData);

    const updatedState = useSearchStore.getState();
    expect(updatedState.data).toEqual(testData);
    expect(updatedState.data.length).toBe(2);
  });

  test('setData can set data to empty array', () => {
    const testData = [{ id: 1, name: 'Sensor1' }];
    useSearchStore.getState().setData(testData);
    expect(useSearchStore.getState().data.length).toBe(1);

    useSearchStore.getState().setData([]);
    expect(useSearchStore.getState().data).toEqual([]);
  });

  test('setRawData updates the rawData array', () => {
    const testRawData = [{ raw: 'data1' }, { raw: 'data2' }];
    useSearchStore.getState().setRawData(testRawData);

    const updatedState = useSearchStore.getState();
    expect(updatedState.rawData).toEqual(testRawData);
    expect(updatedState.rawData.length).toBe(2);
  });

  test('setRawData replaces previous rawData completely', () => {
    const rawData1 = [{ raw: 'data1' }];
    const rawData2 = [{ raw: 'data2' }, { raw: 'data3' }];

    useSearchStore.getState().setRawData(rawData1);
    expect(useSearchStore.getState().rawData).toEqual(rawData1);

    useSearchStore.getState().setRawData(rawData2);
    expect(useSearchStore.getState().rawData).toEqual(rawData2);
    expect(useSearchStore.getState().rawData.length).toBe(2);
  });

  test('multiple updates are independent', () => {
    const newStats = { regulators: 150, ligands: 60 };
    const newData = [{ id: 1, name: 'Test' }];
    const newRawData = [{ raw: 'test' }];

    useSearchStore.getState().setStats(newStats);
    useSearchStore.getState().setData(newData);
    useSearchStore.getState().setRawData(newRawData);

    const updatedState = useSearchStore.getState();
    expect(updatedState.stats).toEqual(newStats);
    expect(updatedState.data).toEqual(newData);
    expect(updatedState.rawData).toEqual(newRawData);
  });

  test('setStats does not affect data or rawData', () => {
    const originalData = [{ id: 1 }];
    useSearchStore.getState().setData(originalData);

    useSearchStore.getState().setStats({ regulators: 100, ligands: 50 });

    expect(useSearchStore.getState().data).toEqual(originalData);
    expect(useSearchStore.getState().rawData).toEqual([]);
  });

  test('setData does not affect stats or rawData', () => {
    const originalStats = { regulators: 100, ligands: 50 };
    useSearchStore.getState().setStats(originalStats);

    useSearchStore.getState().setData([{ id: 1 }]);

    expect(useSearchStore.getState().stats).toEqual(originalStats);
    expect(useSearchStore.getState().rawData).toEqual([]);
  });
});
