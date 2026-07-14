# Archive

Legacy **V1** UI code, retired on 2026-07-11 when groovDB V2 went live and the
feature flags that used to gate V2 were removed. Kept for history/reference; none
of this is imported by the live app (it is outside `src/`, so it is never built).

The feature-flag system itself (`src/zustand/featureFlags.store.js`, the flag
fetch in `App.js`, and the per-component `useFeatureFlag` gates) was deleted
rather than archived — V2 is now the only path.

## What's here

- `Components/Sensor_Components/SensorPage.js` + `SinglePageView.js`,
  `GenomeContext.js`, `ReferenceViewer.js` — the V1 sensor page and the
  sub-viewers only it used. (V2 lives in `Sensor_Components/V2/` +
  `SensorPageV2*`.) Note: `LigandViewer`, `MetadataTable`, `OperatorViewer`,
  `SeqViewer`, `DNAbinding`, and `ProteinStructure` were **kept** in `src/`
  because the live add-sensor `Preview` and the V2 `ProteinPanel` still use them.
- `Components/EditSensor.js` — V1 edit page (V2 is `EditSensorV2` + `editSensorV2/`).
- `Components/SensorTable.js` — V1 browse table (V2 is `Sensor_Components/SensorTableV2`).
- `Components/About/TempSensor.js`, `Components/About/Admin/Admin.js` (the V1
  portion), `AdminTempSensors.js`, `AdminProcessedSensors.js` — the V1 admin
  portal (V2 is `About/Admin/v2/`).
- `Components/addSensor/tabViews/`, `AddSensorStepper.js`, `AddSensorFooter.js` —
  the V1 single-protein add-sensor form (V2 is `addSensor/v2_form/`).
- `lib/ValidationSchema.js`, `lib/constants/InitialValues.js` — V1 add/edit form
  schema + initial values (V2 uses `lib/constants/v2_form/`).
- `queries/sensors.js` — `useAllSensors` hook, only used by the V1 table/download.

Relative imports inside these files may point at paths that no longer resolve
from `archive/` (e.g. into `src/`); that's expected — the code is not compiled.
