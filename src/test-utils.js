// Shared render helper. Wraps a component in the same providers App.js uses so
// components that call useQuery, useNavigate/useParams, useThemeMode, or
// useSnackbar work in tests.
//
// Usage:
//   import { renderWithProviders, screen, userEvent } from '../../test-utils';
//   renderWithProviders(<MyComponent />);
//   renderWithProviders(<MyComponent />, { route: '/entry/TetR/P0ACU5' });
//
// For components that read route params via <Routes>, pass your own routing in
// `ui` and set `route` to the initial URL, e.g.:
//   renderWithProviders(
//     <Routes><Route path="/entry/:family/:id" element={<SensorPage />} /></Routes>,
//     { route: '/entry/TetR/P0ACU5' }
//   );
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { CustomThemeProvider } from './contexts/ThemeContext';

// A fresh QueryClient per render, with retries off so failed/mocked queries
// settle immediately instead of retrying for seconds.
export function makeTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function AllProviders({ children, route = '/', queryClient }) {
  const client = queryClient || makeTestQueryClient();
  return (
    <MemoryRouter
      initialEntries={[route]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <QueryClientProvider client={client}>
        <CustomThemeProvider>
          <SnackbarProvider maxSnack={1}>{children}</SnackbarProvider>
        </CustomThemeProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
}

export function renderWithProviders(ui, options = {}) {
  const { route = '/', queryClient, ...renderOptions } = options;
  const client = queryClient || makeTestQueryClient();
  const Wrapper = ({ children }) => (
    <AllProviders route={route} queryClient={client}>
      {children}
    </AllProviders>
  );
  return {
    user: userEvent.setup(),
    queryClient: client,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Re-export the testing-library API so test files have a single import source.
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
