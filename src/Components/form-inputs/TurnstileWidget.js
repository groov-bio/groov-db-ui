import { Turnstile } from '@marsidev/react-turnstile';
import { useField } from 'formik';
import { Box, useTheme, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function TurnstileWidget({ name, siteKey }) {
  const theme = useTheme();
  const [, meta, helpers] = useField(name);

  // Check if we're in a test environment
  const isTestEnvironment = window.Cypress || process.env.NODE_ENV === 'test';

  useEffect(() => {
    // Auto-fill with mock token in test environment
    if (isTestEnvironment) {
      helpers.setValue('mock-turnstile-token-for-testing');
    }
  }, [isTestEnvironment, helpers]);

  // Render mock widget in test environment
  if (isTestEnvironment) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          p: 2,
          border: '1px dashed #ccc',
          borderRadius: 1,
        }}
        data-testid="mock-turnstile"
      >
        <Typography variant="caption" color="text.secondary">
          Mock CAPTCHA (Test Mode)
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Turnstile
        siteKey={siteKey}
        options={{
          theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
          size: 'normal',
        }}
        onSuccess={(token) => helpers.setValue(token)}
        onError={() => helpers.setValue('')}
        onExpire={() => helpers.setValue('')}
      />
    </Box>
  );
}
