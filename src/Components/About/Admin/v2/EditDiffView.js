import React, { useMemo } from 'react';
import { Box, Chip, Typography, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Admin diff view for a sensor edit. Renders:
 *   1. A summary of which sections changed (About, Stimulus, References, …).
 *   2. A field-by-field FROM → TO list of the concrete changes.
 *   3. The pre-edit and proposed JSON side by side.
 *
 * `previous` is the pre-edit prod snapshot captured by editSensorV2 at submit
 * time; `proposed` is the edited object awaiting approval. Both share the same
 * shape (read-only fields were forced to prod values on submit), so a plain
 * recursive compare surfaces only what the user actually changed.
 */

const isObject = (v) => v !== null && typeof v === 'object';

// Flat list of changed leaves as { path, from, to, kind }.
function diffObjects(oldVal, newVal, path = '') {
  const changes = [];

  if (
    isObject(oldVal) &&
    isObject(newVal) &&
    Array.isArray(oldVal) === Array.isArray(newVal)
  ) {
    const keys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
    for (const key of keys) {
      const childPath = Array.isArray(oldVal)
        ? `${path}[${key}]`
        : path
        ? `${path}.${key}`
        : key;
      changes.push(...diffObjects(oldVal?.[key], newVal?.[key], childPath));
    }
    return changes;
  }

  if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
    changes.push({
      path,
      from: oldVal,
      to: newVal,
      kind:
        oldVal === undefined
          ? 'added'
          : newVal === undefined
          ? 'removed'
          : 'changed',
    });
  }
  return changes;
}

// Map a change path to a human-readable section label for the summary chips.
function sectionForPath(path) {
  if (path.startsWith('about')) return 'About';
  if (path.startsWith('proteins')) {
    if (path.includes('.stimulus')) return 'Stimulus';
    if (path.includes('.references')) return 'References';
    if (path.includes('.dna')) return 'DNA / Operator';
    if (path.includes('.context')) return 'Operon context';
    if (path.includes('.structures')) return 'Structures';
    if (path.includes('.origin')) return 'Origin';
    if (path.includes('.mutations')) return 'Mutations';
    if (path.includes('.alias')) return 'Protein alias';
    if (path.includes('.regulation_type')) return 'Regulation type';
    return 'Protein info';
  }
  const root = path.split(/[.[]/)[0];
  return root ? root.charAt(0).toUpperCase() + root.slice(1) : 'Other';
}

// Compact, readable rendering of a scalar or nested value for the FROM → TO list.
function formatValue(value) {
  if (value === undefined) return '(absent)';
  if (value === null) return '(null)';
  if (value === '') return '(empty)';
  if (typeof value === 'string') return value;
  const json = JSON.stringify(value);
  return json.length > 300 ? `${json.slice(0, 300)}…` : json;
}

// Stringify with recursively sorted object keys so that a difference in key
// order between the two blobs (they come from different sources) never shows up
// as churn in the line diff — only genuine key/value differences do.
function stableStringify(value) {
  const sortKeys = (v) => {
    if (Array.isArray(v)) return v.map(sortKeys);
    if (v !== null && typeof v === 'object') {
      return Object.keys(v)
        .sort()
        .reduce((acc, k) => {
          acc[k] = sortKeys(v[k]);
          return acc;
        }, {});
    }
    return v;
  };
  return JSON.stringify(sortKeys(value), null, 2);
}

// Classic LCS line diff → a flat op list of equal / del / add rows.
function lcsLineOps(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const ops = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: 'equal', left: a[i], right: b[j], leftNo: i + 1, rightNo: j + 1 });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: 'del', left: a[i], leftNo: i + 1 });
      i++;
    } else {
      ops.push({ type: 'add', right: b[j], rightNo: j + 1 });
      j++;
    }
  }
  while (i < n) ops.push({ type: 'del', left: a[i], leftNo: i++ + 1 });
  while (j < m) ops.push({ type: 'add', right: b[j], rightNo: j++ + 1 });
  return ops;
}

// Zip the op list into aligned side-by-side rows: a run of deletions followed by
// a run of additions is paired up ('change'), the GitHub side-by-side layout.
function alignedDiffRows(previous, proposed) {
  const left = stableStringify(previous ?? {}).split('\n');
  const right = stableStringify(proposed ?? {}).split('\n');
  const ops = lcsLineOps(left, right);
  const rows = [];
  let k = 0;
  while (k < ops.length) {
    if (ops[k].type === 'equal') {
      const o = ops[k++];
      rows.push({ type: 'equal', left: o.left, right: o.right, leftNo: o.leftNo, rightNo: o.rightNo });
      continue;
    }
    const dels = [];
    const adds = [];
    while (k < ops.length && ops[k].type === 'del') dels.push(ops[k++]);
    while (k < ops.length && ops[k].type === 'add') adds.push(ops[k++]);
    const max = Math.max(dels.length, adds.length);
    for (let t = 0; t < max; t++) {
      const d = dels[t];
      const a = adds[t];
      rows.push({
        type: d && a ? 'change' : d ? 'del' : 'add',
        left: d ? d.left : null,
        leftNo: d ? d.leftNo : null,
        right: a ? a.right : null,
        rightNo: a ? a.rightNo : null,
      });
    }
  }
  return rows;
}

function SideBySideDiff({ previous, proposed }) {
  const rows = useMemo(() => alignedDiffRows(previous, proposed), [previous, proposed]);

  const cell = (kind, side) => {
    // side: 'left' colours deletions, 'right' colours additions.
    const isChanged =
      (side === 'left' && (kind === 'del' || kind === 'change')) ||
      (side === 'right' && (kind === 'add' || kind === 'change'));
    return {
      fontFamily: 'monospace',
      fontSize: '0.75rem',
      lineHeight: 1.5,
      px: 1,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-all',
      bgcolor: isChanged
        ? (theme) =>
            alpha(
              theme.palette[side === 'left' ? 'error' : 'success'].main,
              theme.palette.mode === 'dark' ? 0.22 : 0.13
            )
        : 'transparent',
    };
  };

  const gutter = (kind, side) => ({
    ...cell(kind, side),
    px: 0.75,
    textAlign: 'right',
    color: 'text.disabled',
    userSelect: 'none',
    borderRight: '1px solid',
    borderColor: 'divider',
  });

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'auto',
        maxHeight: 560,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'auto minmax(0, 1fr) auto minmax(0, 1fr)',
          minWidth: 'fit-content',
        }}
      >
        {rows.map((r, idx) => (
          <React.Fragment key={idx}>
            <Box sx={gutter(r.type, 'left')}>{r.leftNo ?? ''}</Box>
            <Box sx={cell(r.type, 'left')}>{r.left ?? ''}</Box>
            <Box sx={gutter(r.type, 'right')}>{r.rightNo ?? ''}</Box>
            <Box sx={cell(r.type, 'right')}>{r.right ?? ''}</Box>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

export default function EditDiffView({ previous, proposed }) {
  const changes = useMemo(
    () => diffObjects(previous ?? {}, proposed ?? {}),
    [previous, proposed]
  );

  const sections = useMemo(() => {
    const set = new Set();
    changes.forEach((c) => set.add(sectionForPath(c.path)));
    return [...set];
  }, [changes]);

  if (!previous) {
    return (
      <Typography variant="body2" color="text.secondary">
        No pre-edit snapshot is available for this submission, so a diff can’t be
        shown. (Snapshots are captured for edits submitted after this feature
        shipped — older queued edits won’t have one.)
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Sections changed
        </Typography>
        {sections.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No differences detected between the current sensor and this edit.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {sections.map((s) => (
              <Chip key={s} label={s} color="warning" size="small" />
            ))}
          </Box>
        )}
      </Box>

      {changes.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Changes ({changes.length})
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {changes.map((c) => (
              <Box
                key={c.path}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'monospace', color: 'text.secondary' }}
                >
                  {c.path || '(root)'}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'baseline',
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      color: 'error.main',
                      textDecoration:
                        c.kind === 'removed' ? 'line-through' : 'none',
                      wordBreak: 'break-word',
                    }}
                  >
                    {formatValue(c.from)}
                  </Box>
                  <Box component="span" sx={{ color: 'text.disabled' }}>
                    →
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      color: 'success.main',
                      wordBreak: 'break-word',
                    }}
                  >
                    {formatValue(c.to)}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Divider />

      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
            mb: 1,
          }}
        >
          <Typography variant="subtitle2">Full JSON (before → after)</Typography>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Typography variant="caption" color="text.secondary">
              Current (prod)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Proposed edit
            </Typography>
          </Box>
        </Box>
        <SideBySideDiff previous={previous} proposed={proposed} />
      </Box>
    </Box>
  );
}
