import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import AboutSensorTab from './tabViews/AboutSensorTab';
import OperatorSensorTab from './tabViews/OperatorSensorTab';
import LigandSensorTab from './tabViews/LigandSensorTab';
import Preview from './Preview';
import AddSensorFooter from './AddSensorFooter';
import AddSensorStepper from './AddSensorStepper';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Formik, Form } from 'formik';
import validationSchema, { isCompleteEntry } from '../../lib/ValidationSchema';
import useUserStore from '../../zustand/user.store';
import { useSnackbar } from 'notistack';

export default function AddSensor() {
  const user = useUserStore((context) => context.user);
  // mobile-friendly theme setting
  const [view, setView] = useState('form');
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.up('sm'));
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [stepValue, setStepValue] = useState(0);

  const TabPanel = ({ children, value, index }) => {
    return (
      <Box role="tabpanel" hidden={value !== index}>
        {value === index && <Box>{children}</Box>}
      </Box>
    );
  };

  const initialValues = {
    about: {
      alias: '',
      accession: '',
      uniProtID: '',
      family: '',
      mechanism: '',
      about: '',
    },
    ligands: [
      {
        name: '',
        SMILES: '',
        doi: '',
        ref_figure: '',
        fig_type: '',
        method: '',
      },
    ],
    operators: [
      {
        sequence: '',
        method: '',
        ref_figure: '',
        fig_type: '',
        doi: '',
      },
    ],
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
    // Make a copy of values to avoid manipulating formik state
    const copiedValues = JSON.parse(JSON.stringify(values));

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

    const resp = await fetch(`https://api.groov.bio/insertForm`, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        Authorization: user.cognitoUser
          .getSignInUserSession()
          .getAccessToken()
          .getJwtToken(),
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
  };

  const getForm = (formikValues) => {
    return (
      <Box
        sx={{
          ml: { xs: 2, sm: 10 },
          mr: 2,
          mt: 5,
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
        <TabPanel value={stepValue} index={0}>
          <AboutSensorTab />
        </TabPanel>
        <TabPanel value={stepValue} index={1}>
          <LigandSensorTab />
        </TabPanel>
        <TabPanel value={stepValue} index={2}>
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
        <Preview />
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
