/**
 * Thin wrappers for the V2 admin endpoints documented in
 * grv_v2_docs/status/v2-api-changes-updated.md.
 *
 * Base URL is fixed — local + prod both hit api.groov.bio. Feature flags decide
 * what the UI renders, not which API to talk to.
 */

const V2_API_BASE = 'https://api.groov.bio';

function authHeaders(user) {
  return {
    Accept: 'application/json',
    Authorization: user.cognitoUser
      .getSignInUserSession()
      .getIdToken()
      .getJwtToken(),
  };
}

async function parseJsonOrEmpty(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function getAllTempSensorsV2(user) {
  const res = await fetch(`${V2_API_BASE}/v2/getAllTempSensors`, {
    headers: authHeaders(user),
  });
  if (res.status === 204) return { submissions: [] };
  if (!res.ok) {
    const body = await parseJsonOrEmpty(res);
    throw new Error(body.message || `Failed to load temp sensors (${res.status})`);
  }
  return res.json();
}

export async function getTempSensorV2(user, submissionUUID) {
  const res = await fetch(
    `${V2_API_BASE}/v2/getTempSensor?submissionUUID=${encodeURIComponent(submissionUUID)}`,
    { headers: authHeaders(user) }
  );
  if (!res.ok) {
    const body = await parseJsonOrEmpty(res);
    throw new Error(body.message || `Failed to load submission (${res.status})`);
  }
  return res.json();
}

export async function getAllProcessedTempV2(user) {
  const res = await fetch(`${V2_API_BASE}/v2/getAllProcessedTemp`, {
    headers: authHeaders(user),
  });
  if (res.status === 204) return { processed: [] };
  if (!res.ok) {
    const body = await parseJsonOrEmpty(res);
    throw new Error(body.message || `Failed to load processed sensors (${res.status})`);
  }
  return res.json();
}

export async function getProcessedTempV2(user, submissionUUID) {
  const res = await fetch(
    `${V2_API_BASE}/v2/getProcessedTemp?submissionUUID=${encodeURIComponent(submissionUUID)}`,
    { headers: authHeaders(user) }
  );
  if (!res.ok) {
    const body = await parseJsonOrEmpty(res);
    throw new Error(body.message || `Failed to load processed sensor (${res.status})`);
  }
  return res.json();
}

/**
 * Approve a raw temp submission — runs UniProt/PDB/KEGG/operon enrichment
 * on the backend and writes the result to groov-temp-v2-processed.
 *
 * Returns { status, body } so the caller can branch on 202 / 409 / 404 / 400 / 500.
 */
export async function addNewSensorV2(user, submissionUUID) {
  const res = await fetch(`${V2_API_BASE}/v2/addNewSensor`, {
    method: 'POST',
    headers: { ...authHeaders(user), 'Content-Type': 'application/json' },
    body: JSON.stringify({ submissionUUID }),
  });
  return { status: res.status, body: await parseJsonOrEmpty(res) };
}

/**
 * Reject (delete) a raw temp submission.
 * Returns { status } — 204 success, 404 already gone, 400/500 error.
 */
export async function deleteTempV2(user, submissionUUID) {
  const res = await fetch(`${V2_API_BASE}/v2/deleteTemp`, {
    method: 'POST',
    headers: { ...authHeaders(user), 'Content-Type': 'application/json' },
    body: JSON.stringify({ submissionUUID }),
  });
  return { status: res.status, body: await parseJsonOrEmpty(res) };
}

/**
 * Promote a processed temp sensor into the live published database.
 * Processed-temp rows are keyed by submissionUUID alone (PK="PROCESSED"); the
 * backend derives the category from the row's data, so no category is sent.
 * Returns { status, body } so the caller can branch on:
 *   200 success { message, grv_id, category }
 *   404 not found | 409 already promoted | 400 bad input | 500 error
 */
export async function approveProcessedSensorV2(user, submissionUUID) {
  const res = await fetch(`${V2_API_BASE}/v2/approveProcessedSensor`, {
    method: 'POST',
    headers: { ...authHeaders(user), 'Content-Type': 'application/json' },
    body: JSON.stringify({ submissionUUID }),
  });
  return { status: res.status, body: await parseJsonOrEmpty(res) };
}

/**
 * Reject (delete) a processed temp sensor without promoting it.
 * Keyed by submissionUUID alone (PK="PROCESSED").
 * Returns { status, body } — 204 success, 404 already gone.
 */
export async function rejectProcessedSensorV2(user, submissionUUID) {
  const res = await fetch(`${V2_API_BASE}/v2/rejectProcessedSensor`, {
    method: 'POST',
    headers: { ...authHeaders(user), 'Content-Type': 'application/json' },
    body: JSON.stringify({ submissionUUID }),
  });
  return { status: res.status, body: await parseJsonOrEmpty(res) };
}

/**
 * Delete a live published sensor by grv_id.
 * Returns { status, body } so the caller can branch on:
 *   200 success { message, grv_id, category }
 *   404 not found | 400 bad input | 500 error
 */
export async function deleteSensorV2(user, category, grv_id) {
  const res = await fetch(`${V2_API_BASE}/v2/deleteSensor`, {
    method: 'POST',
    headers: { ...authHeaders(user), 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, grv_id }),
  });
  return { status: res.status, body: await parseJsonOrEmpty(res) };
}

/**
 * Fetch the public R2 CDN index of all published sensors — same source the
 * public sensor tables use. No auth required.
 *
 * The admin delete console must reflect current production state, so we bypass
 * the browser + Cloudflare edge cache: `cache: 'no-store'` skips the browser
 * cache, and the unique `?t=` query string forces a CDN cache miss (the public
 * tables intentionally use the cached URL without the buster).
 * Returns { stats: { regulators, ligands }, sensors: [ { id, alias,
 *   uniprot_id, organism_name, category, ligands[] } ] }
 */
export async function fetchPublishedSensorsV2() {
  const res = await fetch(`https://groov-api.com/v2/index.json?t=${Date.now()}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Failed to load published sensors (${res.status})`);
  }
  return res.json();
}
