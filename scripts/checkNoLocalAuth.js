#!/usr/bin/env node
// prebuild guard — runs automatically before `npm run build` (npm's
// implicit `prebuild` lifecycle hook; see package.json). Never invoked by
// `npm start`, and .env.development (which sets REACT_APP_LOCAL_AUTH=true
// for local dev) is only loaded by react-scripts for `start`, not `build`,
// so this check does not see it and does not affect local dev at all.
//
// This is the single most dangerous env var in the system:
// REACT_APP_LOCAL_AUTH gates the entire local-auth bypass path
// (src/utils/auth.js), which skips real Cognito auth. If it is ever truthy
// in a production build, that bypass gets baked into the bundle shipped to
// real users. Refuse to build rather than risk that.
const value = process.env.REACT_APP_LOCAL_AUTH;

const isTruthy = !!value && value !== "0" && value.toLowerCase() !== "false";

if (isTruthy) {
  console.error(
    [
      "",
      "ERROR: REACT_APP_LOCAL_AUTH is set (" + JSON.stringify(value) + ") — refusing to build.",
      "",
      "REACT_APP_LOCAL_AUTH gates the local-auth bypass in src/utils/auth.js,",
      "which skips real Cognito authentication. It must NEVER be enabled in a",
      "build, or that bypass ships to production.",
      "",
      "This most likely means REACT_APP_LOCAL_AUTH is set in the Amplify",
      "console's environment variables for this app/branch. Remove it there.",
      "",
      "(Local dev is unaffected by this check: `npm start` never runs this",
      "prebuild script, and .env.development — where REACT_APP_LOCAL_AUTH=true",
      "lives for local dev — is only read by `react-scripts start`, not",
      "`react-scripts build`.)",
      "",
    ].join("\n")
  );
  process.exit(1);
}

process.exit(0);
