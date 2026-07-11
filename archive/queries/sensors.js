import { useQuery } from '@tanstack/react-query';

export const useAllSensors = () => {
  return useQuery({
    queryKey: ['allSensors'],
    queryFn: async () => {
      const response = await fetch('https://groov-api.com/all-sensors.json', {
        headers: {
          Accept: 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch all sensors');
      }
      
      const data = await response.json();
      return data.sensors || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};