import React, { useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
  Divider,
} from '@mui/material';

/**
 * Preview component for raw V2 submissions — renders the un-enriched
 * { sensor: { mechanism, about, proteins: [...] } } shape produced by
 * /v2/insertForm. Used in the admin temp queue before the admin clicks
 * "Approve" to run enrichment.
 *
 * Not to be confused with SensorPageV2View, which renders the *processed*
 * sensor model (the result of /v2/addNewSensor).
 */
export default function TempSensorPreviewV2({ submission }) {
  const [activeProtein, setActiveProtein] = useState(0);

  if (!submission) return null;

  const { sensor, user, timeSubmit, submissionUUID } = submission;
  const proteins = sensor?.proteins ?? [];
  const isMulti = proteins.length > 1;
  const current = proteins[activeProtein];

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
          {sensor?.mechanism && (
            <Chip
              label={sensor.mechanism}
              size="small"
              variant="outlined"
            />
          )}
          <Chip label={`${proteins.length} protein${proteins.length === 1 ? '' : 's'}`} size="small" />
          {user && <Chip label={`User: ${user}`} size="small" variant="outlined" />}
          {timeSubmit && (
            <Chip
              label={new Date(timeSubmit).toLocaleString()}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
          {submissionUUID}
        </Typography>
        {sensor?.about && (
          <Typography variant="body2" sx={{ mt: 2, lineHeight: 1.6 }}>
            {sensor.about}
          </Typography>
        )}
      </Paper>

      {isMulti && (
        <Paper sx={{ borderRadius: 2 }}>
          <Tabs
            value={activeProtein}
            onChange={(_, v) => setActiveProtein(v)}
            variant="fullWidth"
          >
            {proteins.map((p, idx) => (
              <Tab
                key={p.id ?? idx}
                label={p.alias || `Protein ${idx + 1}`}
              />
            ))}
          </Tabs>
        </Paper>
      )}

      {current && <ProteinSection protein={current} />}
    </Stack>
  );
}

function ProteinSection({ protein }) {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {protein.alias || 'Unnamed protein'}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>UniProt ID</TableCell>
                <TableCell>NCBI Accession</TableCell>
                <TableCell>Family</TableCell>
                <TableCell>Mutations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>
                  {protein.uniProtID ? (
                    <Link
                      href={`https://www.uniprot.org/uniprot/${protein.uniProtID}`}
                      target="_blank"
                      rel="noopener"
                    >
                      {protein.uniProtID}
                    </Link>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>
                  {protein.accession ? (
                    <Link
                      href={`https://www.ncbi.nlm.nih.gov/protein/${protein.accession}`}
                      target="_blank"
                      rel="noopener"
                    >
                      {protein.accession}
                    </Link>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>{protein.family || '—'}</TableCell>
                <TableCell>
                  {protein.mutations?.length
                    ? protein.mutations.join(', ')
                    : '—'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ListSection title="Ligands" rows={protein.ligands} columns={LIGAND_COLS} />
      <ListSection title="Operators" rows={protein.operators} columns={OPERATOR_COLS} />
      <ListSection title="Light stimuli" rows={protein.light_stimuli} columns={LIGHT_COLS} />
      <ListSection title="Temperature stimuli" rows={protein.temperature_stimuli} columns={TEMP_COLS} />
    </Stack>
  );
}

const LIGAND_COLS = [
  { key: 'name', label: 'Name' },
  { key: 'SMILES', label: 'SMILES' },
  { key: 'regulatory_effect', label: 'Effect' },
  { key: 'method', label: 'Method' },
  { key: 'ref_figure', label: 'Ref' },
  { key: 'doi', label: 'DOI' },
  { key: 'kd', label: 'Kd' },
];

const OPERATOR_COLS = [
  { key: 'sequence', label: 'Sequence' },
  { key: 'method', label: 'Method' },
  { key: 'ref_figure', label: 'Ref' },
  { key: 'doi', label: 'DOI' },
  { key: 'kd', label: 'Kd' },
];

const LIGHT_COLS = [
  { key: 'wavelength', label: 'Wavelength' },
  { key: 'regulatory_effect', label: 'Effect' },
  { key: 'method', label: 'Method' },
  { key: 'ref_figure', label: 'Ref' },
  { key: 'doi', label: 'DOI' },
];

const TEMP_COLS = [
  { key: 'temperature', label: 'Temperature' },
  { key: 'regulatory_effect', label: 'Effect' },
  { key: 'method', label: 'Method' },
  { key: 'ref_figure', label: 'Ref' },
  { key: 'doi', label: 'DOI' },
];

function ListSection({ title, rows, columns }) {
  if (!rows || rows.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary">
          None submitted
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.key}>{c.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((c) => (
                  <TableCell key={c.key} sx={{ wordBreak: 'break-all' }}>
                    {formatCell(row[c.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function formatCell(v) {
  if (v === null || v === undefined || v === '') return '—';
  return String(v);
}
