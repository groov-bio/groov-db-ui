import React from 'react';
import { Box, Typography, Link, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useFeatureFlag } from '../zustand/featureFlags.store.js';

/**
 * Publication + "what's new" callout for the home page.
 *
 * Rendered inline within the home page content (previously a fixed overlay in
 * the top-right corner, which overlapped the hero on smaller screens). The V2
 * link is gated behind the v2_sensor_page feature flag.
 */
const NARBanner = () => {
  const showV2Page = useFeatureFlag('v2_sensor_page');

  return (
    <Box
      sx={{
        mt: 3,
        mx: 'auto',
        maxWidth: 520,
        bgcolor: 'background.paper',
        color: 'text.primary',
        px: 2,
        py: 1.5,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Stack spacing={0.5} alignItems="center" textAlign="center">
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
            fontWeight: 400,
          }}
        >
          Now published in{' '}
          <Link
            href="https://doi.org/10.1093/nar/gkaf1074"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="primary"
          >
            <i>Nucleic Acids Research</i>
          </Link>
        </Typography>

        {showV2Page && (
          <Typography
            variant="body2"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' }, fontWeight: 400 }}
          >
            ✨{' '}
            <Link
              component={RouterLink}
              to="/about/v2"
              underline="hover"
              color="primary"
            >
              See what&apos;s new in groovDB V2
            </Link>
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default NARBanner;
