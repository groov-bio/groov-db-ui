import { useState } from 'react';
import { Box } from '@mui/material';
import { useFormikContext } from 'formik';
import AboutSensorTab from '../tabViews/AboutSensorTab';
import LigandSensorTab from '../tabViews/LigandSensorTab';
import OperatorSensorTab from '../tabViews/OperatorSensorTab';
import AddSensorFooter from '../AddSensorFooter';
import AddSensorStepper from '../AddSensorStepper';

const TabPanel = ({ children, value, index, id }) => {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && <Box id={id}>{children}</Box>}
    </Box>
  );
};

export default function ProteinForm({ proteinIndex }) {
  const [stepValue, setStepValue] = useState(0);
  const formik = useFormikContext();

  const proteinErrors = formik.errors?.proteins?.[proteinIndex] || {};

  return (
    <Box>
      <AddSensorStepper
        stepValue={stepValue}
        setStepValue={setStepValue}
        formikErrors={proteinErrors}
      />

      {proteinErrors.form && (
        <Box
          gridColumn="span 12"
          sx={{ color: 'error.main', mt: 2, mx: 3, textAlign: 'center' }}
        >
          {proteinErrors.form}
        </Box>
      )}

      {/* About Section */}
      <TabPanel value={stepValue} index={0} id={`protein-${proteinIndex}-about-tab`}>
        <AboutSensorTab fieldPrefix={`proteins[${proteinIndex}]`} />
      </TabPanel>

      {/* Ligands Section */}
      <TabPanel value={stepValue} index={1} id={`protein-${proteinIndex}-ligand-tab`}>
        <LigandSensorTab fieldPrefix={`proteins[${proteinIndex}]`} />
      </TabPanel>

      {/* Operators Section */}
      <TabPanel value={stepValue} index={2} id={`protein-${proteinIndex}-operator-tab`}>
        <OperatorSensorTab fieldPrefix={`proteins[${proteinIndex}]`} />
      </TabPanel>

      <AddSensorFooter stepValue={stepValue} setStepValue={setStepValue} />
    </Box>
  );
}
