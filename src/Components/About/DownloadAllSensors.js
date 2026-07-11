import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useAllSensors } from '../../queries/sensors.js';
import { useFeatureFlag } from '../../zustand/featureFlags.store';
import { withCacheBust } from '../../lib/utils.js';

export default function DownloadAllSensors() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: sensorsData = [], isLoading, error } = useAllSensors();
  const v2SensorTablesEnabled = useFeatureFlag('v2_sensor_tables');

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      let dataToDownload;
      if (v2SensorTablesEnabled) {
        const response = await fetch(withCacheBust('https://groov-api.com/v2/all-sensors.json'));
        dataToDownload = await response.json();
      } else if (sensorsData.length > 0) {
        dataToDownload = { sensors: sensorsData };
      } else {
        const response = await fetch(withCacheBust('https://groov-api.com/all-sensors.json'));
        dataToDownload = await response.json();
      }

      // Create a blob from the data
      const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
        type: 'application/json',
      });

      // Create a URL for the blob
      const url = URL.createObjectURL(blob);

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = v2SensorTablesEnabled ? 'all-sensors-v2.json' : 'all-sensors.json';
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

  const buttonLoading = isLoading || isDownloading;
  const buttonDisabled = buttonLoading || error;

  return (
    <Button
      variant="contained"
      startIcon={
        buttonLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <DownloadIcon />
        )
      }
      id="download-all-sensors-button"
      onClick={handleDownload}
      disabled={buttonDisabled}
      sx={{ whiteSpace: 'nowrap', minWidth: '200px' }}
    >
      {isLoading
        ? 'Loading...'
        : isDownloading
        ? 'Downloading...'
        : error
        ? 'Error loading data'
        : 'Download All Sensors'}
    </Button>
  );
}
