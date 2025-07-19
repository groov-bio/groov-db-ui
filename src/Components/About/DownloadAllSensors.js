import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function DownloadAllSensors() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://groov-api.com/all-sensors.json');
      const data = await response.json();

      // Create a blob from the data
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'all-sensors.json';
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading sensors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={
        loading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <DownloadIcon />
        )
      }
      onClick={handleDownload}
      disabled={loading}
      sx={{ whiteSpace: 'nowrap', minWidth: '200px' }}
    >
      {loading ? 'Downloading...' : 'Download All Sensors'}
    </Button>
  );
}
