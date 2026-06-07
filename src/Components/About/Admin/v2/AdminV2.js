import React, { useEffect, useMemo, useState } from 'react';
import {
  Container,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';

import useUserStore from '../../../../zustand/user.store';
import { useFeatureFlag } from '../../../../zustand/featureFlags.store';
import {
  getAllProcessedTempV2,
  getAllTempSensorsV2,
  getProcessedTempV2,
} from '../../../../lib/api/v2Admin';
import AdminTempSensorsV2 from './AdminTempSensorsV2';
import AdminProcessedSensorsV2 from './AdminProcessedSensorsV2';

export default function AdminV2() {
  const user = useUserStore((s) => s.user);
  const v2ApiEnabled = useFeatureFlag('v2_api', false);

  const [submissions, setSubmissions] = useState(null);
  const [processed, setProcessed] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [approveIsLoading, setApproveIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    Promise.all([
      getAllTempSensorsV2(user).catch((err) => ({ __error: err })),
      getAllProcessedTempV2(user).catch((err) => ({ __error: err })),
    ]).then(([tempRes, processedRes]) => {
      if (cancelled) return;
      if (tempRes?.__error || processedRes?.__error) {
        setLoadError(
          (tempRes?.__error?.message || processedRes?.__error?.message) ??
            'Failed to load V2 admin data'
        );
      }
      setSubmissions(tempRes?.submissions ?? []);
      setProcessed(processedRes?.processed ?? []);
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const processedUUIDs = useMemo(
    () => new Set((processed ?? []).map((p) => p.submissionUUID)),
    [processed]
  );

  const handleApproved = async (submissionUUID) => {
    // Optimistically reload processed list so the new row shows up and the
    // temp row's "Approve" button flips to "Processed".
    try {
      const row = await getProcessedTempV2(user, submissionUUID);
      setProcessed((prev) => {
        const without = (prev ?? []).filter(
          (p) => p.submissionUUID !== submissionUUID
        );
        return [...without, row];
      });
      return;
    } catch {
      // fall through to full refetch
    }

    try {
      const { processed: refetched } = await getAllProcessedTempV2(user);
      setProcessed(refetched ?? []);
    } catch {
      // best-effort; row will appear on next page load
    }
  };

  const handleRejected = (submissionUUID) => {
    setSubmissions((prev) =>
      (prev ?? []).filter((s) => s.submissionUUID !== submissionUUID)
    );
  };

  const handleProcessedApproved = (submissionUUID) => {
    setProcessed((prev) =>
      (prev ?? []).filter((p) => p.submissionUUID !== submissionUUID)
    );
  };

  const handleProcessedRejected = (submissionUUID) => {
    setProcessed((prev) =>
      (prev ?? []).filter((p) => p.submissionUUID !== submissionUUID)
    );
  };

  const isLoading = submissions === null || processed === null;

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: 30, sm: 36, md: 48 },
            fontWeight: 300,
            textAlign: 'center',
            mb: 6,
            mt: 4,
          }}
          id="admin-page-header"
        >
          Administrator page (V2)
        </Typography>

        {!v2ApiEnabled && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <code>v2_api</code> is off — approve/reject calls will fail. Enable
            it in <code>feature-flags.json</code> to use this page.
          </Alert>
        )}

        {loadError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loadError}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <AdminProcessedSensorsV2
              user={user}
              processed={processed}
              onApproved={handleProcessedApproved}
              onRejected={handleProcessedRejected}
            />
            <AdminTempSensorsV2
              user={user}
              submissions={submissions}
              processedUUIDs={processedUUIDs}
              onApproved={handleApproved}
              onRejected={handleRejected}
              setApproveIsLoading={setApproveIsLoading}
            />
          </>
        )}
      </Container>

      <Dialog open={approveIsLoading}>
        <DialogContent
          sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 4 }}
        >
          <CircularProgress />
          <Typography>Processing submission…</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
