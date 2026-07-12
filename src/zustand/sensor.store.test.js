import useSensorStore from './sensor.store';

describe('useSensorStore', () => {
  beforeEach(() => {
    useSensorStore.setState({
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
      sensorData: {},
      v2SensorData: {},
    });
  });

  describe('sensorTable initialization', () => {
    test('initializes sensorTable with all family keys as empty arrays', () => {
      const state = useSensorStore.getState();
      expect(state.sensorTable).toHaveProperty('tetr', []);
      expect(state.sensorTable).toHaveProperty('lysr', []);
      expect(state.sensorTable).toHaveProperty('arac', []);
      expect(state.sensorTable).toHaveProperty('marr', []);
      expect(state.sensorTable).toHaveProperty('laci', []);
      expect(state.sensorTable).toHaveProperty('gntr', []);
      expect(state.sensorTable).toHaveProperty('luxr', []);
      expect(state.sensorTable).toHaveProperty('iclr', []);
      expect(state.sensorTable).toHaveProperty('other', []);
    });

    test('all family keys should be arrays', () => {
      const state = useSensorStore.getState();
      const families = Object.keys(state.sensorTable);
      families.forEach((family) => {
        expect(Array.isArray(state.sensorTable[family])).toBe(true);
      });
    });
  });

  describe('setSensorTable', () => {
    test('updates a single family in sensorTable', () => {
      const testData = [{ id: '1', name: 'Sensor1' }];
      useSensorStore.getState().setSensorTable('tetr', testData);

      const updatedState = useSensorStore.getState();
      expect(updatedState.sensorTable.tetr).toEqual(testData);
    });

    test('only updates the specified family, leaves others unchanged', () => {
      const tetrData = [{ id: '1', name: 'TetR1' }];
      const lysrData = [{ id: '2', name: 'LysR1' }];

      useSensorStore.getState().setSensorTable('tetr', tetrData);
      useSensorStore.getState().setSensorTable('lysr', lysrData);

      const updatedState = useSensorStore.getState();
      expect(updatedState.sensorTable.tetr).toEqual(tetrData);
      expect(updatedState.sensorTable.lysr).toEqual(lysrData);
      expect(updatedState.sensorTable.arac).toEqual([]);
      expect(updatedState.sensorTable.marr).toEqual([]);
    });

    test('can replace existing family data', () => {
      const firstData = [{ id: '1' }];
      const secondData = [{ id: '2' }, { id: '3' }];

      useSensorStore.getState().setSensorTable('tetr', firstData);
      expect(useSensorStore.getState().sensorTable.tetr).toEqual(firstData);

      useSensorStore.getState().setSensorTable('tetr', secondData);
      expect(useSensorStore.getState().sensorTable.tetr).toEqual(secondData);
    });

    test('can update any family key', () => {
      const families = ['tetr', 'lysr', 'arac', 'marr', 'laci', 'gntr', 'luxr', 'iclr', 'other'];

      families.forEach((family, index) => {
        const testData = [{ id: index, family }];
        useSensorStore.getState().setSensorTable(family, testData);
        expect(useSensorStore.getState().sensorTable[family]).toEqual(testData);
      });
    });
  });

  describe('sensorData', () => {
    test('initializes sensorData as empty object', () => {
      const state = useSensorStore.getState();
      expect(state.sensorData).toEqual({});
    });

    test('setSensorData adds a new entry with uniprotID', () => {
      const testData = { name: 'P00001', info: 'SensorInfo' };
      useSensorStore.getState().setSensorData('P00001', testData);

      const updatedState = useSensorStore.getState();
      expect(updatedState.sensorData['P00001']).toEqual(testData);
    });

    test('setSensorData can add multiple entries', () => {
      useSensorStore.getState().setSensorData('P00001', { name: 'Sensor1' });
      useSensorStore.getState().setSensorData('P00002', { name: 'Sensor2' });

      const updatedState = useSensorStore.getState();
      expect(updatedState.sensorData['P00001']).toEqual({ name: 'Sensor1' });
      expect(updatedState.sensorData['P00002']).toEqual({ name: 'Sensor2' });
    });

    test('setSensorData can replace existing entry with same uniprotID', () => {
      useSensorStore.getState().setSensorData('P00001', { name: 'OldData' });
      useSensorStore.getState().setSensorData('P00001', { name: 'NewData' });

      const updatedState = useSensorStore.getState();
      expect(updatedState.sensorData['P00001']).toEqual({ name: 'NewData' });
    });
  });

  describe('v2SensorData', () => {
    test('initializes v2SensorData as empty object', () => {
      const state = useSensorStore.getState();
      expect(state.v2SensorData).toEqual({});
    });

    test('setV2SensorData adds a new entry with id', () => {
      const testData = { id: 'sensor-1', name: 'V2Sensor1', description: 'Test' };
      useSensorStore.getState().setV2SensorData('sensor-1', testData);

      const updatedState = useSensorStore.getState();
      expect(updatedState.v2SensorData['sensor-1']).toEqual(testData);
    });

    test('setV2SensorData can add multiple entries', () => {
      useSensorStore.getState().setV2SensorData('sensor-1', { name: 'V2Sensor1' });
      useSensorStore.getState().setV2SensorData('sensor-2', { name: 'V2Sensor2' });

      const updatedState = useSensorStore.getState();
      expect(updatedState.v2SensorData['sensor-1']).toEqual({ name: 'V2Sensor1' });
      expect(updatedState.v2SensorData['sensor-2']).toEqual({ name: 'V2Sensor2' });
    });

    test('setV2SensorData can replace existing entry with same id', () => {
      useSensorStore.getState().setV2SensorData('sensor-1', { name: 'OldV2Data' });
      useSensorStore.getState().setV2SensorData('sensor-1', { name: 'NewV2Data' });

      const updatedState = useSensorStore.getState();
      expect(updatedState.v2SensorData['sensor-1']).toEqual({ name: 'NewV2Data' });
    });
  });

  describe('cross-store isolation', () => {
    test('updating sensorTable does not affect sensorData', () => {
      useSensorStore.getState().setSensorData('P00001', { name: 'SensorData1' });
      useSensorStore.getState().setSensorTable('tetr', [{ id: '1' }]);

      const updatedState = useSensorStore.getState();
      expect(updatedState.sensorData['P00001']).toEqual({ name: 'SensorData1' });
      expect(updatedState.sensorTable.tetr).toEqual([{ id: '1' }]);
    });

    test('updating v2SensorData does not affect other data', () => {
      useSensorStore.getState().setSensorData('P00001', { name: 'SensorData1' });
      useSensorStore.getState().setV2SensorData('sensor-1', { name: 'V2Data1' });

      const updatedState = useSensorStore.getState();
      expect(updatedState.sensorData['P00001']).toEqual({ name: 'SensorData1' });
      expect(updatedState.v2SensorData['sensor-1']).toEqual({ name: 'V2Data1' });
    });
  });
});
