import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import AboutSensorTab from './addSensor/tabViews/AboutSensorTab';
import OperatorSensorTab from './addSensor/tabViews/OperatorSensorTab';
import LigandSensorTab from './addSensor/tabViews/LigandSensorTab';
import Preview from './addSensor/Preview';
import AddSensorFooter from './addSensor/AddSensorFooter';
import AddSensorStepper from './addSensor/AddSensorStepper';
import _ from 'lodash';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Formik, Form } from 'formik';
import validationSchema, { isCompleteEntry } from '../lib/ValidationSchema';
import useUserStore from '../zustand/user.store';
import useSensorStore from '../zustand/sensor.store';
import { useSnackbar } from 'notistack';

export default function EditSensor() {
  const { family, sensorID } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((context) => context.user);
  const sensorData = useSensorStore((context) => context.sensorData[sensorID]);
  const setSensorData = useSensorStore((context) => context.setSensorData);

  const [view, setView] = useState('form');
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.up('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const [stepValue, setStepValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (!sensorData && family && sensorID) {
      fetch(
        `https://groov-api.com/sensors/${family.toLowerCase()}/${sensorID.toUpperCase()}.json`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setSensorData(data.uniprotID, data);
          populateInitialValues(data);
        })
        .catch((err) => {
          enqueueSnackbar('Error loading sensor data', { variant: 'error' });
          setLoading(false);
        });
    } else if (sensorData) {
      populateInitialValues(sensorData);
    }
  }, [family, sensorID, sensorData]);

  const populateInitialValues = (data) => {
    const parseRefFigure = (refFigure) => {
      if (!refFigure) return { ref_figure: '', fig_type: '' };

      if (refFigure.startsWith('Figure S')) {
        return {
          ref_figure: refFigure.replace('Figure S', ''),
          fig_type: 'Supplementary Figure',
        };
      } else if (refFigure.startsWith('Table S')) {
        return {
          ref_figure: refFigure.replace('Table S', ''),
          fig_type: 'Supplementary Table',
        };
      } else if (refFigure.startsWith('Table ')) {
        return {
          ref_figure: refFigure.replace('Table ', ''),
          fig_type: 'Table',
        };
      } else if (refFigure.startsWith('Figure ')) {
        return {
          ref_figure: refFigure.replace('Figure ', ''),
          fig_type: 'Figure',
        };
      } else {
        return {
          ref_figure: refFigure,
          fig_type: 'Figure',
        };
      }
    };

    const normalizeMechanism = (regulationType) => {
      if (!regulationType) return '';

      const lowerType = regulationType.toLowerCase();
      const mechanismMap = {
        'apo-repressor': 'Apo-repressor',
        'co-repressor': 'Co-repressor',
        'apo-activator': 'Apo-activator',
        'co-activator': 'Co-activator',
      };

      return mechanismMap[lowerType] || regulationType;
    };

    const normalizeFigureType = (figType) => {
      if (!figType) return 'Figure';

      const lowerType = figType.toLowerCase();
      const figureTypeMap = {
        figure: 'Figure',
        'supplementary figure': 'Supplementary Figure',
        table: 'Table',
        'supplementary table': 'Supplementary Table',
      };

      return figureTypeMap[lowerType] || figType;
    };

    const normalizeLigandMethod = (method) => {
      if (!method) return '';

      const lowerMethod = method.toLowerCase();
      const ligandMethodMap = {
        emsa: 'EMSA',
        'dnase footprinting': 'DNase footprinting',
        'isothermal titration calorimetry': 'Isothermal titration calorimetry',
        'surface plasmon resonance': 'Surface plasmon resonance',
        'synthetic regulation': 'Synthetic regulation',
        'fluorescence polarization': 'Fluorescence polarization',
      };

      return ligandMethodMap[lowerMethod] || method;
    };

    const normalizeOperatorMethod = (method) => {
      if (!method) return '';

      const lowerMethod = method.toLowerCase();
      const operatorMethodMap = {
        emsa: 'EMSA',
        'dnase footprinting': 'DNase footprinting',
        'surface plasmon resonance': 'Surface plasmon resonance',
        'crystal structure': 'Crystal structure',
        'isothermal titration calorimetry': 'Isothermal titration calorimetry',
        'fluorescence polarization': 'Fluorescence polarization',
        'synthetic regulation': 'Synthetic regulation',
      };

      return operatorMethodMap[lowerMethod] || method;
    };

    const values = {
      about: {
        alias: data.alias || '',
        accession: data.accession || '',
        uniProtID: data.uniprotID || '',
        family: family || '',
        mechanism: normalizeMechanism(data.regulationType),
        about: data.about || '',
      },
      ligands:
        data.ligands?.length > 0
          ? data.ligands.map((ligand) => {
              const { ref_figure, fig_type } = parseRefFigure(
                ligand.ref_figure
              );
              return {
                name: ligand.name || '',
                SMILES: ligand.SMILES || '',
                doi: ligand.fullDOI?.doi || ligand.doi || '',
                ref_figure,
                fig_type: normalizeFigureType(fig_type),
                method: normalizeLigandMethod(ligand.method),
              };
            })
          : [
              {
                name: '',
                SMILES: '',
                doi: '',
                ref_figure: '',
                fig_type: 'Figure',
                method: '',
              },
            ],
      operators:
        data.operators?.length > 0
          ? data.operators.map((operator) => {
              const { ref_figure, fig_type } = parseRefFigure(
                operator.ref_figure
              );
              return {
                sequence: operator.sequence || '',
                method: normalizeOperatorMethod(operator.method),
                ref_figure,
                fig_type: normalizeFigureType(fig_type),
                doi: operator.fullDOI?.doi || operator.doi || '',
              };
            })
          : [
              {
                sequence: '',
                method: '',
                ref_figure: '',
                fig_type: 'Figure',
                doi: '',
              },
            ],
    };

    setInitialValues(values);
    setLoading(false);
  };

  const TabPanel = ({ children, value, index }) => {
    return (
      <Box role="tabpanel" hidden={value !== index}>
        {value === index && <Box>{children}</Box>}
      </Box>
    );
  };

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
    if (_.isEqual(values, initialValues)) {
      enqueueSnackbar('No changes detected. Please modify the form before submitting.', {
        variant: 'info',
      });
      return;
    }

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

    try {
      const resp = await fetch(`https://api.groov.bio/updateSensor`, {
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
        enqueueSnackbar(`Successfully requested updated of sensor ${copiedValues.about.alias}! Please check back in a few days.`, {
          variant: 'success',
        });
        navigate(`/database/${family}/${copiedValues.about.alias}`);
      } else {
        const result = await resp.json();
        enqueueSnackbar(result.message || 'Error updating sensor', {
          variant: 'error',
        });
      }
    } catch (error) {
      enqueueSnackbar('Network error updating sensor', {
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
        <Typography
          variant="h4"
          sx={{ mb: 3, textAlign: 'center', fontWeight: 300 }}
        >
          Edit Sensor: {sensorData?.alias}
        </Typography>

        <AddSensorStepper
          stepValue={stepValue}
          setStepValue={setStepValue}
          formikErrors={formikValues.errors}
        />

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

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/database/${family}/${sensorData?.alias}`)}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
        </Box>
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

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Typography>Loading sensor data...</Typography>
      </Box>
    );
  }

  if (!initialValues) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <Typography>Error loading sensor data</Typography>
      </Box>
    );
  }

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
