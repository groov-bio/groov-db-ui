import { create } from 'zustand';
import { produce } from 'immer';

/**
 * Current flags:
 * v2_api
 * v2_add_sensor_form
 * v2_admin_portal
 * v2_sensor_page
 */

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

export const getEnvironment = () => {
  return isProduction() ? 'prod' : 'local';
};

/**
 * This Zustand store holds feature flags fetched from the remote JSON
 * Access flags anywhere in the app via: useFeatureFlagsStore((state) => state.flags)
 */
const useFeatureFlagsStore = create((set) => ({
  flags: {},
  loading: false,
  error: null,

  setFlags: (flags) => {
    set(
      produce((draft) => {
        draft.flags = flags;
        draft.loading = false;
        draft.error = null;
      })
    );
  },

  setLoading: (loading) => {
    set(
      produce((draft) => {
        draft.loading = loading;
      })
    );
  },

  setError: (error) => {
    set(
      produce((draft) => {
        draft.error = error;
        draft.loading = false;
      })
    );
  },
}));

export const useFeatureFlag = (flagName, defaultValue = false) => {
  return useFeatureFlagsStore((state) => {
    const flag = state.flags[flagName];
    if (!flag) return defaultValue;

    const env = getEnvironment();
    return flag[env] ?? defaultValue;
  });
};

export default useFeatureFlagsStore;
