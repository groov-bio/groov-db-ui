import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Grid,
  Chip,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import ProteinPanel from './V2/ProteinPanel';

const TYPE_COLOR = {
  'One Component': 'primary',
  'Two Component': 'secondary',
  Riboswitch: 'success',
};

/**
 * Presentational V2 sensor renderer. Used by the public sensor route
 * (SensorPageV2) and by the admin processed-temp preview, where there is no
 * GRV ID yet and no edit button.
 */
export default function SensorPageV2View({
  sensor,
  hideEditButton = false,
  onEdit,
}) {
  const [activeProteinTab, setActiveProteinTab] = useState(0);
  const [isNightingaleLoaded, setIsNightingaleLoaded] = useState(false);

  const proteins = sensor?.proteins ?? [];
  const isMultiProtein = proteins.length > 1;

  const proteinAliasLabel = proteins
    .map((p) => p.alias)
    .filter(Boolean)
    .join('/');

  const displayTitle = proteinAliasLabel || `${sensor?.category} Sensor`;

  return (
    <Container sx={{ py: 3 }}>
      <Stack spacing={3}>
        <Paper
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 100%)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 500,
                  mb: 0.5,
                  background: (theme) =>
                    theme.palette.mode === 'dark' ? 'white' : 'black',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {displayTitle}
              </Typography>

              {sensor?.id && (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mb: 1.5, fontFamily: 'monospace', letterSpacing: 1 }}
                >
                  {sensor.id}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                {sensor?.category && (
                  <Chip
                    label={sensor.category}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                )}
                {sensor?.type && (
                  <Chip
                    label={sensor.type}
                    color={TYPE_COLOR[sensor.type] ?? 'default'}
                    size="small"
                  />
                )}
              </Box>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.6 }}
              >
                {sensor?.about}
              </Typography>
            </Box>

            {!hideEditButton && (
              <Box sx={{ width: { xs: '100%', sm: 'auto' }, flexShrink: 0 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<EditIcon />}
                  onClick={onEdit}
                  sx={{
                    width: { xs: '100%', sm: 'auto' },
                    borderRadius: 2,
                    px: { xs: 2, sm: 3 },
                    py: { xs: 0.6, sm: 0.9 },
                    fontSize: { xs: '0.7rem', sm: '0.9rem' },
                    whiteSpace: 'nowrap',
                  }}
                >
                  Edit Sensor
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

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
                  key={protein.uniprot_id ?? idx}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
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

        {proteins.map((protein, idx) => (
          <Box
            key={protein.uniprot_id ?? idx}
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
