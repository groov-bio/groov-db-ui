import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import AboutSensorTab from './tabViews/AboutSensorTab';
import OperatorSensorTab from './tabViews/OperatorSensorTab';
import LigandSensorTab from './tabViews/LigandSensorTab';
import Preview from './Preview';
import AddSensorFooter from './AddSensorFooter';
import AddSensorStepper from './AddSensorStepper';
import ProteinTabs from './v2_form/ProteinTabs';
import ProteinForm from './v2_form/ProteinForm';

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

export default function AddSensor() {
  const user = useUserStore((context) => context.user);
  // Check if feature flags are still loading
  const flagsLoading = useFeatureFlagsStore((state) => state.loading);
  // Get the v2 form feature flag for current environment (local or prod)
  const useV2Form = useFeatureFlag('v2_add_sensor_form', false);

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

      // V2 form: Process multiple proteins
      if (useV2Form && copiedValues.proteins) {
        const validToken = await getValidToken();

        const proteinsData = copiedValues.proteins.map((protein) => ({
          family: protein.about.family.toUpperCase(),
          uniProtID: protein.about.uniProtID,
          about: {
            about: protein.about?.about,
            accession: protein.about.accession,
            alias: protein.about.alias,
            mechanism: protein.about.mechanism,
          },
          ...(protein.ligands.length > 1 ||
          protein.ligands?.some(isCompleteEntry)
            ? {
                ligands: {
                  data: processFigures(protein.ligands),
                },
              }
            : {}),
          ...(protein.operators.length > 1 ||
          protein.operators?.some(isCompleteEntry)
            ? {
                operator: {
                  data: processFigures(protein.operators),
                },
              }
            : {}),
          user: user.cognitoUser.getUsername(),
          timeSubmit: Date.now(),
          // TODO - add experiment data here
        }));

        const resp = await fetch(`https://api.groov.bio/insertForm`, {
          method: 'POST',
          headers: {
            Accept: '*/*',
            Authorization: validToken,
          },
          body: JSON.stringify({ proteins: proteinsData }),
        });

        if (!resp.ok) {
          const result = await resp.json();
          throw new Error(result.message || 'Failed to submit proteins');
        }

        const aliases = copiedValues.proteins.map((p) => p.about.alias);
        enqueueSnackbar(
          `Successfully submitted ${aliases.length} protein(s): ${aliases.join(', ')}`,
          {
            variant: 'success',
          }
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
          {/* Protein tabs for managing multiple proteins */}
          <FieldArray name="proteins">
            {({ push, remove }) => (
              <>
                <ProteinTabs
                  proteins={formikValues.values.proteins}
                  currentProteinIndex={currentProteinIndex}
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
