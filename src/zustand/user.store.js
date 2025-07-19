import { create } from 'zustand';
import { produce } from 'immer';

/**
 * This Zustand store will hold our user data from Amplify Auth
 */
const useUserStore = create((set) => ({
  user: null,

  setUser: (user) => {
    set(
      produce((draft) => {
        draft.user = user;
      })
    );
  },
}));

export default useUserStore;
