import React, { useState } from 'react';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import AboutSensorTab from './tabViews/AboutSensorTab';
import OperatorSensorTab from './tabViews/OperatorSensorTab';
import LigandSensorTab from './tabViews/LigandSensorTab';
import Preview from './Preview';
import AddSensorFooter from './AddSensorFooter';
import AddSensorStepper from './AddSensorStepper';
import ProteinTabs from './v2_form/ProteinTabs';
import ProteinForm from './v2_form/ProteinForm';
import SensorMetaTab from './v2_form/SensorMetaTab';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Formik, Form, FieldArray } from 'formik';
import validationSchema, { isCompleteEntry } from '../../lib/ValidationSchema';
import useUserStore from '../../zustand/user.store';
import useFeatureFlagsStore, { useFeatureFlag } from '../../zustand/featureFlags.store';
import { useSnackbar } from 'notistack';
import { getValidToken } from '../../utils/auth';

import { initialValues } from '../../lib/constants/InitialValues';
import { v2_initialValues, createEmptyProtein } from '../../lib/constants/v2_form/initialValues';
import v2_validationSchema from '../../lib/constants/v2_form/validationSchema';

const V2_API_BASE = 'https://api.groov.bio';

// Joins fig_type ("Figure" / "Supplementary Figure" / "Table" / "Supplementary Table")
// and ref_figure ("3" / "S5" / "2A") into the canonical "Figure 3" / "Figure S3" / "Table S5" form
// the BE Joi expects. Mutates and returns the entry object with `ref_figure` set, fig_type removed.
const joinFigure = (entry) => {
  const num = entry.ref_figure ?? '';
  switch (entry.fig_type) {
    case 'Supplementary Figure':
      entry.ref_figure = `Figure S${num}`;
      break;
    case 'Table':
      entry.ref_figure = `Table ${num}`;
      break;
    case 'Supplementary Table':
      entry.ref_figure = `Table S${num}`;
      break;
    default:
      entry.ref_figure = `Figure ${num}`;
      break;
  }
  delete entry.fig_type;
  return entry;
};

const cleanNumber = (v) => {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const cleanOptionalString = (v) => (v == null || v === '' ? null : v);

// Convert a Kd value to nanomolar based on the input unit (nM/µM/mM).
// Returns null if the value is missing/invalid so callers can omit the field.
const kdToNanomolar = (rawValue, unit) => {
  const n = cleanNumber(rawValue);
  if (n == null) return null;
  const factor = unit === 'mM' ? 1_000_000 : unit === 'µM' ? 1_000 : 1;
  return n * factor;
};

// Reshape Formik v2 form values into the sensor-shaped payload the v2 BE expects.
// Only fields whose required keys are filled in pass through; partially-filled
// optional rows (e.g. light stimuli with no wavelength) are dropped.
const reshapeForV2Submit = (values, user) => {
  const proteins = values.proteins.map((p) => {
    const ligands = (p.ligands ?? [])
      .filter((l) => l.name && l.SMILES && l.doi && l.method && l.ref_figure && l.fig_type)
      .map((l) => {
        const out = joinFigure({ ...l });
        return {
          name: out.name,
          SMILES: out.SMILES,
          doi: out.doi,
          method: out.method,
          ref_figure: out.ref_figure,
          ...(cleanOptionalString(out.regulatory_effect) != null && { regulatory_effect: out.regulatory_effect }),
          ...(kdToNanomolar(out.kd, out.kd_unit) != null && { kd: kdToNanomolar(out.kd, out.kd_unit) }),
        };
      });

    const operators = (p.operators ?? [])
      .filter((o) => o.sequence && o.doi && o.method && o.ref_figure && o.fig_type)
      .map((o) => {
        const out = joinFigure({ ...o });
        return {
          sequence: out.sequence,
          doi: out.doi,
          method: out.method,
          ref_figure: out.ref_figure,
          ...(kdToNanomolar(out.kd, out.kd_unit) != null && { kd: kdToNanomolar(out.kd, out.kd_unit) }),
        };
      });

    const light_stimuli = (p.light_stimuli ?? [])
      .filter((s) => s.wavelength !== '' && s.wavelength != null)
      .map((s) => {
        const out = s.fig_type ? joinFigure({ ...s }) : { ...s };
        return {
          wavelength: cleanNumber(out.wavelength),
          ...(cleanOptionalString(out.regulatory_effect) != null && { regulatory_effect: out.regulatory_effect }),
          ...(cleanOptionalString(out.doi) != null && { doi: out.doi }),
          ...(cleanOptionalString(out.method) != null && { method: out.method }),
          ...(cleanOptionalString(out.ref_figure) != null && { ref_figure: out.ref_figure }),
        };
      });

    const temperature_stimuli = (p.temperature_stimuli ?? [])
      .filter((s) => s.temperature !== '' && s.temperature != null)
      .map((s) => {
        const out = s.fig_type ? joinFigure({ ...s }) : { ...s };
        return {
          temperature: cleanNumber(out.temperature),
          ...(cleanOptionalString(out.regulatory_effect) != null && { regulatory_effect: out.regulatory_effect }),
          ...(cleanOptionalString(out.doi) != null && { doi: out.doi }),
          ...(cleanOptionalString(out.method) != null && { method: out.method }),
          ...(cleanOptionalString(out.ref_figure) != null && { ref_figure: out.ref_figure }),
        };
      });

    const mutations = (p.mutations ?? [])
      .filter((m) => m && m.mutations && m.mutations.trim() !== '' && m.ref_id && m.ref_id.trim() !== '')
      .map((m) => ({
        mutations: m.mutations.split(',').map((s) => s.trim()).filter(Boolean),
        ref_type: m.ref_type || 'UniProt',
        ref_id: m.ref_id.trim(),
      }));

    return {
      alias: p.alias,
      uniProtID: p.uniProtID,
      accession: p.accession,
      family: p.family,
      ...(ligands.length > 0 && { ligands }),
      ...(operators.length > 0 && { operators }),
      ...(light_stimuli.length > 0 && { light_stimuli }),
      ...(temperature_stimuli.length > 0 && { temperature_stimuli }),
      ...(mutations.length > 0 && { mutations }),
    };
  });

  return {
    sensor: {
      mechanism: values.sensor.mechanism,
      ...(values.sensor.about && { about: values.sensor.about }),
      proteins,
    },
    user,
    timeSubmit: Date.now(),
  };
};

export default function AddSensor() {
  const user = useUserStore((context) => context.user);
  // Check if feature flags are still loading
  const flagsLoading = useFeatureFlagsStore((state) => state.loading);
  // Get the v2 form feature flag for current environment (local or prod)
  const useV2Form = useFeatureFlag('v2_add_sensor_form', false);
  // Gates whether v2 endpoints are callable. The v2 form REQUIRES this; if the
  // form flag is on but this is off, we render the form in preview mode and
  // disable submit (the v1 endpoint can't accept the v2 payload shape).
  const useV2Api = useFeatureFlag('v2_api', false);

  // mobile-friendly theme setting
  const [view, setView] = useState('form');
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.up('sm'));
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [stepValue, setStepValue] = useState(0);

  const [currentProteinIndex, setCurrentProteinIndex] = useState(0);

  // Wait for feature flags to load before rendering
  if (flagsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  const TabPanel = ({ children, value, index, id }) => {
    return (
      <Box role="tabpanel" hidden={value !== index}>
        {value === index && <Box id={id}>{children}</Box>}
      </Box>
    );
  };


  /**
   * This function processes ligands/operators to make ref_figure only a number or prepend S
   * Ex - Figure 5 or figure S5
   * It also deletes fig_type since that's not required for backend
   * @param {array} data
   */
  const processFigures = (data) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].fig_type === 'Supplementary Figure') {
        data[i].ref_figure = `Figure S${data[i].ref_figure}`;
        delete data[i].fig_type;
      } else if (data[i].fig_type === 'Table') {
        data[i].ref_figure = `Table ${data[i].ref_figure}`;
        delete data[i].fig_type;
      } else if (data[i].fig_type === 'Supplementary Table') {
        data[i].ref_figure = `Table S${data[i].ref_figure}`;
        delete data[i].fig_type;
      } else {
        data[i].ref_figure = `Figure ${data[i].ref_figure}`;
        delete data[i].fig_type;
      }
    }

    return data;
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Make a copy of values to avoid manipulating formik state
      const copiedValues = JSON.parse(JSON.stringify(values));

      // V2 form: sensor-shaped submission, one row containing N proteins
      if (useV2Form && copiedValues.sensor && copiedValues.proteins) {
        if (!useV2Api) {
          enqueueSnackbar(
            'v2 form is in preview mode — enable the v2_api feature flag to submit.',
            { variant: 'warning' }
          );
          return;
        }
        const validToken = await getValidToken();
        const username = user.cognitoUser.getUsername();
        const payload = reshapeForV2Submit(copiedValues, username);

        const resp = await fetch(`${V2_API_BASE}/v2/insertForm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: '*/*',
            Authorization: validToken,
          },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          const result = await resp.json().catch(() => ({}));
          throw new Error(
            result.message ||
              (result.errors ? result.errors.join('; ') : 'Failed to submit sensor')
          );
        }

        const result = await resp.json().catch(() => ({}));
        const aliases = payload.sensor.proteins.map((p) => p.alias);
        enqueueSnackbar(
          `Submitted sensor with ${aliases.length} protein(s): ${aliases.join(', ')}` +
            (result.submissionUUID ? ` — ${result.submissionUUID.slice(0, 8)}` : ''),
          { variant: 'success' }
        );
        resetForm();
        setStepValue(0);
        setCurrentProteinIndex(0);
      } else {
        // V1 form: Single protein submission
        const formData = {
          family: copiedValues.about.family.toUpperCase(),
          uniProtID: copiedValues.about.uniProtID,
          about: {
            about: copiedValues.about?.about,
            accession: copiedValues.about.accession,
            alias: copiedValues.about.alias,
            mechanism: copiedValues.about.mechanism,
          },
          ...(copiedValues.ligands.length > 1 ||
          copiedValues.ligands?.some(isCompleteEntry)
            ? {
                ligands: {
                  data: processFigures(copiedValues.ligands),
                },
              }
            : {}),
          ...(copiedValues.operators.length > 1 ||
          copiedValues.operators?.some(isCompleteEntry)
            ? {
                operator: {
                  data: processFigures(copiedValues.operators),
                },
              }
            : {}),
          user: user.cognitoUser.getUsername(),
          timeSubmit: Date.now(),
        };

        const validToken = await getValidToken();

        const resp = await fetch(`https://api.groov.bio/insertForm`, {
          method: 'POST',
          headers: {
            Accept: '*/*',
            Authorization: validToken,
          },
          body: JSON.stringify(formData),
        });

        if (resp.ok) {
          enqueueSnackbar(
            `Successfully submit ${copiedValues.about.alias}, we will reach out if there's any questions!`,
            {
              variant: 'success',
            }
          );
          resetForm();
          setStepValue(0);
        } else {
          const result = await resp.json();
          enqueueSnackbar(result.message, {
            variant: 'error',
          });
        }
      }
    } catch (error) {
      enqueueSnackbar(
        error.message || 'Error submitting form. Please try again or refresh the page.',
        {
          variant: 'error',
        }
      );
    }
  };

  const getForm = (formikValues) => {
    // V2 form: Multi-protein with tabs
    if (useV2Form) {
      return (
        <Box
          sx={{
            ml: { xs: 2, sm: 10 },
            mr: 2,
            mt: 5,
            mb: 5,
            gridColumn: { xs: 'span 12', sm: 'span 6' },
          }}
        >
          {!useV2Api && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Preview mode — the v2 form is enabled but the v2 API is not. Submissions are disabled until the
              <code style={{ margin: '0 4px' }}>v2_api</code>
              feature flag is also turned on.
            </Alert>
          )}
          <SensorMetaTab />
          {/* Protein tabs for managing multiple proteins */}
          <FieldArray name="proteins">
            {({ push, remove }) => (
              <>
                <ProteinTabs
                  proteins={formikValues.values.proteins}
                  currentProteinIndex={currentProteinIndex}
                  errors={formikValues.errors?.proteins}
                  onProteinChange={(index) => {
                    setCurrentProteinIndex(index);
                    setStepValue(0); 
                  }}
                  onAddProtein={() => {
                    push(createEmptyProtein());
                    setCurrentProteinIndex(formikValues.values.proteins.length);
                    setStepValue(0);
                  }}
                  onRemoveProtein={(index) => {
                    remove(index);
                    if (currentProteinIndex >= formikValues.values.proteins.length - 1) {
                      setCurrentProteinIndex(Math.max(0, formikValues.values.proteins.length - 2));
                    }
                    setStepValue(0);
                  }}
                />

                {formikValues.values.proteins.length > 0 && (
                  <ProteinForm proteinIndex={currentProteinIndex} />
                )}
              </>
            )}
          </FieldArray>
        </Box>
      );
    }

    // V1 form: Original single-protein form
    return (
      <Box
        sx={{
          ml: { xs: 2, sm: 10 },
          mr: 2,
          mt: 5,
          mb: 5,
          gridColumn: { xs: 'span 12', sm: 'span 6' },
        }}
      >
        <AddSensorStepper
          stepValue={stepValue}
          setStepValue={setStepValue}
          formikErrors={formikValues.errors}
        />
        {/* Show form-level error if it exists */}
        {formikValues.errors.form && (
          <Box
            gridColumn="span 12"
            sx={{ color: 'error.main', mt: 2, mx: 3, textAlign: 'center' }}
          >
            {formikValues.errors.form}
          </Box>
        )}
        <TabPanel value={stepValue} index={0} id="new-about-sensor-tab">
          <AboutSensorTab />
        </TabPanel>
        <TabPanel value={stepValue} index={1} id="new-ligand-sensor-tab">
          <LigandSensorTab />
        </TabPanel>
        <TabPanel value={stepValue} index={2} id="new-operator-sensor-tab">
          <OperatorSensorTab />
        </TabPanel>
        <AddSensorFooter stepValue={stepValue} setStepValue={setStepValue} />
      </Box>
    );
  };

  const getPreview = () => {
    return (
      <Box
        sx={{
          mr: { xs: 2, sm: 10 },
          ml: 2,
          mt: 5,
          gridColumn: { xs: 'span 12', sm: 'span 6' },
        }}
      >
        <Preview proteinIndex={useV2Form ? currentProteinIndex : null} />
      </Box>
    );
  };

  const setMobileView = () => {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: '0px',
          backgroundColor: 'white',
          zIndex: 4,
          paddingTop: '10px',
          borderTop: '1px solid black',
          height: '60px',
          width: '100vw',
          textAlign: 'center',
        }}
      >
        <Button onClick={() => setView('form')}>Form</Button>
        <Button onClick={() => setView('preview')}>Preview</Button>
      </Box>
    );
  };

  // Render V2 form if feature flag is enabled
  if (useV2Form) {
    return (
      <Formik
        initialValues={v2_initialValues}
        validationSchema={v2_validationSchema}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <Form>
              <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridTemplateRows="auto"
                gridAutoRows="auto"
                sx={{ height: 'calc(100% + 90px)' }}
              >
                {mobile ? (
                  <>
                    {getForm(formik)}
                    {getPreview()}
                  </>
                ) : view === 'form' ? (
                  <>
                    {getForm(formik)}
                    {setMobileView()}
                  </>
                ) : (
                  <>
                    {getPreview()}
                    {setMobileView()}
                  </>
                )}
              </Box>
            </Form>
          );
        }}
      </Formik>
    );
  }

  // Render original form if V2 flag is disabled
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {(formik) => {
        return (
          <Form>
            <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gridTemplateRows="auto"
              gridAutoRows="auto"
              sx={{ height: 'calc(100% + 90px)' }}
            >
              {mobile ? (
                <>
                  {getForm(formik)}
                  {getPreview()}
                </>
              ) : view === 'form' ? (
                <>
                  {getForm(formik)}
                  {setMobileView()}
                </>
              ) : (
                <>
                  {getPreview()}
                  {setMobileView()}
                </>
              )}
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
}
