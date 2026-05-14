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
