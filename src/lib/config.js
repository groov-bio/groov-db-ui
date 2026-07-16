/**
 * Central, env-driven runtime configuration.
 *
 * Every value here falls back to today's hardcoded production value, so an
 * app built/run with none of these REACT_APP_* vars set (i.e. every
 * existing prod deploy) behaves byte-identical to before this file existed.
 *
 * Local dev (docker compose + Floci) sets these via two layers:
 *   - STATIC vars committed in `.env.development` (this repo).
 *   - DYNAMIC vars (API base, Cognito pool/client ids) written at container
 *     startup into `/shared/ui.env` by the API repo's floci-init
 *     provisioner, sourced into the shell before `react-scripts start` so
 *     CRA bakes them into process.env at build/serve time.
 */

// V2 Lambda API (API Gateway) base — e.g. `${API_BASE}/v2/insertForm`.
// Local: http://localhost:4566/execute-api/{apiId}/dev (dynamic, from floci-init).
export const API_BASE = process.env.REACT_APP_API_BASE || 'https://api.groov.bio';

// Static browse data (Cloudflare R2 in prod / Floci S3 locally), read-only.
// Local dev default points at a Floci-seeded S3 bucket so browse works fully
// offline; set REACT_APP_STATIC_BASE=https://groov-api.com to hit prod data
// from a local UI instead.
export const STATIC_BASE = process.env.REACT_APP_STATIC_BASE || 'https://groov-api.com';

// Master gate for the entire local-auth bypass path in src/utils/auth.js.
// Must be unset (falsy) in every real deployment.
export const LOCAL_AUTH = process.env.REACT_APP_LOCAL_AUTH === 'true';

// Cognito connection info. Region/pool/client fall back to the current
// hardcoded prod values (see src/aws-exports.js pre-existing config).
// ENDPOINT has no prod equivalent (Amplify talks to AWS directly) — it's
// only read by the local-auth path in src/utils/auth.js.
export const COGNITO_REGION = process.env.REACT_APP_COGNITO_REGION || 'us-east-2';
export const COGNITO_USER_POOL_ID =
  process.env.REACT_APP_COGNITO_USER_POOL_ID || 'us-east-2_JO965QtEP';
export const COGNITO_CLIENT_ID =
  process.env.REACT_APP_COGNITO_CLIENT_ID || '2lhdpnuct7nfirl2q8fkq8i2ie';
export const COGNITO_ENDPOINT = process.env.REACT_APP_COGNITO_ENDPOINT || '';

// Which seeded local user the auto-sign-in shim (src/utils/auth.js)
// authenticates as. Both seeds share password GroovLocal1!. Defaults to the
// seeded admin; the API repo's `floci/dev.sh --user` sets
// REACT_APP_LOCAL_AUTH_USER=user@groov.local to sign in as the non-admin seed
// instead. Only read on the LOCAL_AUTH path — no prod equivalent.
export const LOCAL_AUTH_USER =
  process.env.REACT_APP_LOCAL_AUTH_USER || 'admin@groov.local';

