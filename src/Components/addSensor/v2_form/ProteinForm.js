import { useState } from 'react';
import { Box } from '@mui/material';
import { useFormikContext } from 'formik';
import AboutProteinTab from './tabViews/AboutProteinTab';
import LigandTab from './tabViews/LigandTab';
import OperatorTab from './tabViews/OperatorTab';
import ExtraStimuliTab from './tabViews/ExtraStimuliTab';
import ProteinFormStepper from './ProteinFormStepper';
import ProteinFormFooter from './ProteinFormFooter';

const TabPanel = ({ children, value, index, id }) => (
  <Box role="tabpanel" hidden={value !== index}>
    {value === index && <Box id={id}>{children}</Box>}
  </Box>
);

export default function ProteinForm({ proteinIndex }) {
  const [stepValue, setStepValue] = useState(0);
  const formik = useFormikContext();
  const proteinErrors = formik.errors?.proteins?.[proteinIndex] || {};
  const fieldPrefix = `proteins[${proteinIndex}]`;

  return (
    <Box>
      <Box sx={{ mt: 2 }}>
        <ProteinFormStepper
          stepValue={stepValue}
          setStepValue={setStepValue}
          proteinErrors={proteinErrors}
        />
      </Box>

      {proteinErrors.form && (
        <Box gridColumn="span 12" sx={{ color: 'error.main', mt: 2, mx: 3, textAlign: 'center' }}>
          {proteinErrors.form}
        </Box>
      )}

      <TabPanel value={stepValue} index={0} id={`protein-${proteinIndex}-about-tab`}>
        <AboutProteinTab fieldPrefix={fieldPrefix} />
      </TabPanel>
      <TabPanel value={stepValue} index={1} id={`protein-${proteinIndex}-ligand-tab`}>
        <LigandTab fieldPrefix={fieldPrefix} />
      </TabPanel>
      <TabPanel value={stepValue} index={2} id={`protein-${proteinIndex}-operator-tab`}>
        <OperatorTab fieldPrefix={fieldPrefix} />
      </TabPanel>
      <TabPanel value={stepValue} index={3} id={`protein-${proteinIndex}-extras-tab`}>
        <ExtraStimuliTab fieldPrefix={fieldPrefix} />
      </TabPanel>

      <ProteinFormFooter stepValue={stepValue} setStepValue={setStepValue} />
    </Box>
  );
}
