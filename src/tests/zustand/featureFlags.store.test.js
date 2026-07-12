import useFeatureFlagsStore, { isProduction, getEnvironment, useFeatureFlag } from '../../zustand/featureFlags.store';
import { renderHook } from '../../test-utils';

describe('useFeatureFlagsStore', () => {
  beforeEach(() => {
    useFeatureFlagsStore.setState({
      flags: {},
      loading: false,
      error: null,
    });
  });

  describe('store initialization', () => {
    test('initializes with empty flags object', () => {
      const state = useFeatureFlagsStore.getState();
      expect(state.flags).toEqual({});
    });

    test('initializes with loading as false', () => {
      const state = useFeatureFlagsStore.getState();
      expect(state.loading).toBe(false);
    });

    test('initializes with error as null', () => {
      const state = useFeatureFlagsStore.getState();
      expect(state.error).toBeNull();
    });
  });

  describe('setFlags action', () => {
    test('setFlags updates flags object', () => {
      const testFlags = {
        v2_api: { local: true, prod: false },
        v2_add_sensor_form: { local: true, prod: true },
      };
      useFeatureFlagsStore.getState().setFlags(testFlags);

      const updatedState = useFeatureFlagsStore.getState();
      expect(updatedState.flags).toEqual(testFlags);
    });

    test('setFlags sets loading to false', () => {
      useFeatureFlagsStore.getState().setLoading(true);
      expect(useFeatureFlagsStore.getState().loading).toBe(true);

      useFeatureFlagsStore.getState().setFlags({ v2_api: { local: true, prod: false } });
      expect(useFeatureFlagsStore.getState().loading).toBe(false);
    });

    test('setFlags clears error', () => {
      useFeatureFlagsStore.getState().setError('Previous error');
      expect(useFeatureFlagsStore.getState().error).toBe('Previous error');

      useFeatureFlagsStore.getState().setFlags({ v2_api: { local: true, prod: false } });
      expect(useFeatureFlagsStore.getState().error).toBeNull();
    });

    test('setFlags replaces previous flags completely', () => {
      const flags1 = { v2_api: { local: true, prod: false } };
      const flags2 = { v2_admin_portal: { local: true, prod: true } };

      useFeatureFlagsStore.getState().setFlags(flags1);
      expect(useFeatureFlagsStore.getState().flags).toEqual(flags1);

      useFeatureFlagsStore.getState().setFlags(flags2);
      expect(useFeatureFlagsStore.getState().flags).toEqual(flags2);
      expect(useFeatureFlagsStore.getState().flags).not.toHaveProperty('v2_api');
    });
  });

  describe('setLoading action', () => {
    test('setLoading updates loading state to true', () => {
      useFeatureFlagsStore.getState().setLoading(true);

      const updatedState = useFeatureFlagsStore.getState();
      expect(updatedState.loading).toBe(true);
    });

    test('setLoading updates loading state to false', () => {
      useFeatureFlagsStore.getState().setLoading(true);
      useFeatureFlagsStore.getState().setLoading(false);

      const updatedState = useFeatureFlagsStore.getState();
      expect(updatedState.loading).toBe(false);
    });

    test('setLoading does not affect flags or error', () => {
      const testFlags = { v2_api: { local: true, prod: false } };
      useFeatureFlagsStore.getState().setFlags(testFlags);
      useFeatureFlagsStore.getState().setError('Test error');

      useFeatureFlagsStore.getState().setLoading(true);

      const updatedState = useFeatureFlagsStore.getState();
      expect(updatedState.flags).toEqual(testFlags);
      expect(updatedState.error).toBe('Test error');
      expect(updatedState.loading).toBe(true);
    });
  });

  describe('setError action', () => {
    test('setError updates error state', () => {
      useFeatureFlagsStore.getState().setError('Network error');

      const updatedState = useFeatureFlagsStore.getState();
      expect(updatedState.error).toBe('Network error');
    });

    test('setError sets loading to false', () => {
      useFeatureFlagsStore.getState().setLoading(true);
      expect(useFeatureFlagsStore.getState().loading).toBe(true);

      useFeatureFlagsStore.getState().setError('Error occurred');
      expect(useFeatureFlagsStore.getState().loading).toBe(false);
    });

    test('setError does not affect flags', () => {
      const testFlags = { v2_api: { local: true, prod: false } };
      useFeatureFlagsStore.getState().setFlags(testFlags);

      useFeatureFlagsStore.getState().setError('Test error');

      const updatedState = useFeatureFlagsStore.getState();
      expect(updatedState.flags).toEqual(testFlags);
      expect(updatedState.error).toBe('Test error');
    });

    test('setError can be called with null to clear error', () => {
      useFeatureFlagsStore.getState().setError('Initial error');
      expect(useFeatureFlagsStore.getState().error).toBe('Initial error');

      useFeatureFlagsStore.getState().setError(null);
      expect(useFeatureFlagsStore.getState().error).toBeNull();
    });
  });
});

describe('Feature Flag Helper Functions', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('isProduction', () => {
    test('returns false when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      expect(isProduction()).toBe(false);
    });

    test('returns false when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      expect(isProduction()).toBe(false);
    });

    test('returns true when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      expect(isProduction()).toBe(true);
    });
  });

  describe('getEnvironment', () => {
    test('returns "local" when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      expect(getEnvironment()).toBe('local');
    });

    test('returns "local" when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      expect(getEnvironment()).toBe('local');
    });

    test('returns "prod" when NODE_ENV is production', () => {
      process.env.NODE_ENV = 'production';
      expect(getEnvironment()).toBe('prod');
    });
  });
});

describe('useFeatureFlag hook', () => {
  beforeEach(() => {
    useFeatureFlagsStore.setState({
      flags: {},
      loading: false,
      error: null,
    });
    process.env.NODE_ENV = 'test';
  });

  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('returns default value when flag does not exist', () => {
    const { result } = renderHook(() => useFeatureFlag('nonexistent_flag', false));
    expect(result.current).toBe(false);
  });

  test('returns provided default value when flag does not exist', () => {
    const { result } = renderHook(() => useFeatureFlag('nonexistent_flag', true));
    expect(result.current).toBe(true);
  });

  test('returns environment-specific value for existing flag in local environment', () => {
    process.env.NODE_ENV = 'test';
    useFeatureFlagsStore.getState().setFlags({
      v2_api: { local: true, prod: false },
    });

    const { result } = renderHook(() => useFeatureFlag('v2_api', false));
    expect(result.current).toBe(true);
  });

  test('returns environment-specific value for existing flag in production', () => {
    process.env.NODE_ENV = 'production';
    useFeatureFlagsStore.getState().setFlags({
      v2_api: { local: true, prod: false },
    });

    const { result } = renderHook(() => useFeatureFlag('v2_api', false));
    expect(result.current).toBe(false);
  });

  test('returns default value when flag exists but does not have env-specific value', () => {
    process.env.NODE_ENV = 'test';
    useFeatureFlagsStore.getState().setFlags({
      v2_api: { local: true },
    });

    const { result } = renderHook(() => useFeatureFlag('v2_api', false));
    expect(result.current).toBe(true);
  });

  test('returns default value when flag[env] is undefined', () => {
    process.env.NODE_ENV = 'test';
    useFeatureFlagsStore.getState().setFlags({
      v2_api: { prod: true },
    });

    const { result } = renderHook(() => useFeatureFlag('v2_api', false));
    expect(result.current).toBe(false);
  });

  test('hook updates when store flags change', () => {
    process.env.NODE_ENV = 'test';
    useFeatureFlagsStore.getState().setFlags({
      v2_api: { local: false, prod: false },
    });

    const { result, rerender } = renderHook(() => useFeatureFlag('v2_api', false));
    expect(result.current).toBe(false);

    useFeatureFlagsStore.getState().setFlags({
      v2_api: { local: true, prod: false },
    });
    rerender();

    expect(result.current).toBe(true);
  });

  test('returns default value false when not provided', () => {
    const { result } = renderHook(() => useFeatureFlag('nonexistent_flag'));
    expect(result.current).toBe(false);
  });
});
