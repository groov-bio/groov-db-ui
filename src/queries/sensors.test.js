import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { useAllSensors } from './sensors';
import { makeTestQueryClient } from '../test-utils';

function createWrapper() {
  const queryClient = makeTestQueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useAllSensors', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns the sensors array on a successful fetch', async () => {
    const sensors = [{ id: 's1' }, { id: 's2' }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ sensors }),
      })
    );

    const { result } = renderHook(() => useAllSensors(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(sensors);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://groov-api.com/all-sensors.json',
      { headers: { Accept: 'application/json' } }
    );
  });

  it('returns an empty array when the response body has no "sensors" field', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    const { result } = renderHook(() => useAllSensors(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('surfaces an error when the response is not ok', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );

    const { result } = renderHook(() => useAllSensors(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error.message).toBe('Failed to fetch all sensors');
  });
});
