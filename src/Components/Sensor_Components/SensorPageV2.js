import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Stack,
  Skeleton,
  Grid,
  Paper,
} from '@mui/material';

import useSensorStore from '../../zustand/sensor.store';
import useUserStore from '../../zustand/user.store';
import useFeatureFlagsStore, { useFeatureFlag } from '../../zustand/featureFlags.store';
import SensorPageV2View from './SensorPageV2View';

/**
 * Maps the category prefix letter in a GRV ID to the API URL segment.
 * e.g., "GRV-T00001" → prefix "T" → "tetr"
 *
 * NOTE: This mapping must match the actual ID generation scheme used during
 * the v2 data migration. Update this map if the scheme changes.
 */
const ID_PREFIX_TO_CATEGORY = {
  T: 'tetr',
  X: 'luxr',
  Y: 'lysr',
  A: 'arac',
  M: 'marr',
  L: 'laci',
  G: 'gntr',
  I: 'iclr',
  Z: 'other',
  D: 'dual', // two-component systems (TWO_COMPONENT_PREFIX on the backend)
};

function getCategoryFromId(id) {
  const match = id?.match(/^GRV-([A-Z]+)/);
  if (!match) return null;
  return ID_PREFIX_TO_CATEGORY[match[1]] ?? null;
}

export default function SensorPageV2() {
  const { id } = useParams();
  const navigate = useNavigate();

  const v2Enabled = useFeatureFlag('v2_sensor_page');
  const flagsLoading = useFeatureFlagsStore((s) => s.loading);
  const flagsReady = useFeatureFlagsStore((s) => Object.keys(s.flags).length > 0);
  const sensorData = useSensorStore((s) => s.v2SensorData[id]);
  const setV2SensorData = useSensorStore((s) => s.setV2SensorData);
  const currentUser = useUserStore((s) => s.user);

  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (sensorData !== undefined || !id) return;

    const category = getCategoryFromId(id);
    if (!category) {
      setFetchError(`Could not determine category from ID: ${id}`);
      return;
    }

    fetch(`https://groov-api.com/v2/sensors/${category}/${id}.json`, {
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setV2SensorData(id, data))
      .catch((err) => setFetchError(err.message));
  }, [id, sensorData, setV2SensorData]);

  if (flagsLoading || !flagsReady) {
    return null;
  }

  if (!v2Enabled) {
    return <Navigate to="/" replace />;
  }

  if (fetchError) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Sensor not found
        </Typography>
        <Typography color="text.secondary">{fetchError}</Typography>
      </Container>
    );
  }

  if (sensorData === undefined) {
    return (
      <Container sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    );
  }

  return (
    <SensorPageV2View
      sensor={sensorData}
      onEdit={() =>
        navigate(
          currentUser ? `/editSensor/v2/${id}` : '/account?reason=editSensor'
        )
      }
    />
  );
}
