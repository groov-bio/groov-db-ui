import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Skeleton,
  Grid,
  Chip,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import useSensorStore from '../../zustand/sensor.store';
import useUserStore from '../../zustand/user.store';
import useFeatureFlagsStore, { useFeatureFlag } from '../../zustand/featureFlags.store';
import ProteinPanel from './V2/ProteinPanel';

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
  I: 'laci',
  G: 'gntr',
  C: 'iclr',
  O: 'other',
};

function getCategoryFromId(id) {
  const match = id?.match(/^GRV-([A-Z]+)/);
  if (!match) return null;
  return ID_PREFIX_TO_CATEGORY[match[1]] ?? null;
}

const TYPE_COLOR = {
  'One Component': 'primary',
  'Two Component': 'secondary',
  Riboswitch: 'success',
};

export default function SensorPageV2() {
  const { id } = useParams();
  const navigate = useNavigate();

  const v2Enabled = useFeatureFlag('v2_sensor_page');
  const flagsLoading = useFeatureFlagsStore((s) => s.loading);
  const flagsReady = useFeatureFlagsStore((s) => Object.keys(s.flags).length > 0);
  const sensorData = useSensorStore((s) => s.v2SensorData[id]);
  const setV2SensorData = useSensorStore((s) => s.setV2SensorData);
  const currentUser = useUserStore((s) => s.user);

  const [activeProteinTab, setActiveProteinTab] = useState(0);
  const [isNightingaleLoaded, setIsNightingaleLoaded] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const isMultiProtein = sensorData?.proteins?.length > 1;

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

  // Wait for flags to load before deciding whether to gate this route.
  // On initial render flags is {} and loading is false, so we check flagsReady.
  if (flagsLoading || !flagsReady) {
    return null;
  }

  // Feature flag gate — only redirect once flags are confirmed loaded
  if (!v2Enabled) {
    return <Navigate to="/" replace />;
  }

  // Fetch error
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

  // Loading skeleton
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

  const proteins = sensorData.proteins ?? [];
  const primaryAlias = proteins[0]?.alias;

  // Title: alias for single-protein, category label for multi-protein
  const displayTitle =
    proteins.length === 1
      ? primaryAlias
      : `${sensorData.category} Sensor`;

  return (
    <Container sx={{ py: 3 }}>
      <Stack spacing={3}>

        {/* Header */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 2,
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Category + type badges */}
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  label={sensorData.category}
                  color="primary"
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={sensorData.type}
                  color={TYPE_COLOR[sensorData.type] ?? 'default'}
                  size="small"
                />
              </Box>

              {/* Primary title */}
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 500,
                  mb: 0.5,
                  background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                }}
              >
                {displayTitle}
              </Typography>

              {/* GRV ID */}
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ mb: 1.5, fontFamily: 'monospace', letterSpacing: 1 }}
              >
                {sensorData.id}
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                {sensorData.about}
              </Typography>
            </Box>

            {/* Edit button */}
            <Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<EditIcon />}
                onClick={() =>
                  navigate(
                    currentUser
                      ? `/editSensor/v2/${id}`
                      : '/account?reason=editSensor'
                  )
                }
                sx={{
                  borderRadius: 2,
                  px: { xs: 2, sm: 3 },
                  py: { xs: 0.6, sm: 0.9 },
                  fontSize: { xs: '0.7rem', sm: '0.9rem' },
                }}
              >
                Edit Sensor
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Multi-protein tab selector */}
        {isMultiProtein && (
          <Paper sx={{ borderRadius: 2 }}>
            <Tabs
              value={activeProteinTab}
              onChange={(_, v) => setActiveProteinTab(v)}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {proteins.map((protein, idx) => (
                <Tab
                  key={protein.uniprot_id}
                  label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight={600}>
                        {protein.alias}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {protein.uniprot_id}
                      </Typography>
                    </Box>
                  }
                  id={`protein-tab-${idx}`}
                />
              ))}
            </Tabs>
          </Paper>
        )}

        {/* Protein content */}
        {proteins.map((protein, idx) => (
          <Box
            key={protein.uniprot_id}
            hidden={isMultiProtein && activeProteinTab !== idx}
          >
            {(!isMultiProtein || activeProteinTab === idx) && (
              <ProteinPanel
                protein={protein}
                isNightingaleLoaded={isNightingaleLoaded}
                setIsNightingaleLoaded={setIsNightingaleLoaded}
              />
            )}
          </Box>
        ))}

      </Stack>
    </Container>
  );
}
