import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { withCacheBust } from '../../lib/utils.js';

export default function DownloadAllSensors() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const response = await fetch(withCacheBust('https://groov-api.com/v2/all-sensors.json'));
      const dataToDownload = await response.json();

      // Create a blob from the data
      const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
        type: 'application/json',
      });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'all-sensors-v2.json';
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading sensors:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={
        isDownloading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <DownloadIcon />
        )
      }
      id="download-all-sensors-button"
      onClick={handleDownload}
      disabled={isDownloading}
      sx={{ whiteSpace: 'nowrap', minWidth: '200px' }}
    >
      {isDownloading ? 'Downloading...' : 'Download All Sensors'}
    </Button>
  );
}
