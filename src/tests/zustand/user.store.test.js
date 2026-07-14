import useUserStore from '../../zustand/user.store';

describe('useUserStore', () => {
  beforeEach(() => {
    useUserStore.setState({ user: null });
  });

  test('initializes with user as null', () => {
    const state = useUserStore.getState();
    expect(state.user).toBe(null);
  });

  test('setUser updates the user state', () => {
    const testUser = { username: 'john', email: 'john@example.com' };
    useUserStore.getState().setUser(testUser);

    const updatedState = useUserStore.getState();
    expect(updatedState.user).toEqual(testUser);
  });

  test('setUser can set user to null', () => {
    const testUser = { username: 'john', email: 'john@example.com' };
    useUserStore.getState().setUser(testUser);
    expect(useUserStore.getState().user).toEqual(testUser);

    useUserStore.getState().setUser(null);
    expect(useUserStore.getState().user).toBe(null);
  });

  test('setUser replaces previous user completely', () => {
    const user1 = { username: 'john', email: 'john@example.com' };
    const user2 = { username: 'jane', email: 'jane@example.com' };

    useUserStore.getState().setUser(user1);
    expect(useUserStore.getState().user).toEqual(user1);

    useUserStore.getState().setUser(user2);
    expect(useUserStore.getState().user).toEqual(user2);
    expect(useUserStore.getState().user).not.toEqual(user1);
  });

  test('setUser handles complex user objects with nested properties', () => {
    const complexUser = {
      username: 'john',
      email: 'john@example.com',
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        settings: {
          theme: 'dark',
          notifications: true,
        },
      },
    };
    useUserStore.getState().setUser(complexUser);

    const updatedState = useUserStore.getState();
    expect(updatedState.user).toEqual(complexUser);
    expect(updatedState.user.profile.settings.theme).toBe('dark');
  });
});
