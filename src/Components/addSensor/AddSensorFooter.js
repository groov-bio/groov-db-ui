import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';

export default function AddSensorFooter({ stepValue, setStepValue }) {
  const { values, submitForm, setFieldValue } = useFormikContext();

  const addNewLigand = () => {
    const newLigand = {
      name: '',
      SMILES: '',
      doi: '',
      ref_figure: '',
      fig_type: '',
      method: '',
    };
    setFieldValue('ligands', [...values.ligands, newLigand]);
  };

  const addNewOperator = () => {
    const newOperator = {
      sequence: '',
      method: '',
      ref_figure: '',
      fig_type: '',
      doi: '',
    };
    setFieldValue('operators', [...values.operators, newOperator]);
  };

  return (
    <Box
      display="flex"
      sx={{ justifyContent: 'space-between', mx: { xs: 1, sm: 10 } }}
    >
      <Button
        onClick={() => {
          if (stepValue !== 0) {
            setStepValue(stepValue - 1);
          }
        }}
        disabled={stepValue === 0}
      >
        Previous
      </Button>

      {stepValue === 1 && (
        <Button onClick={addNewLigand}>Add New Ligand</Button>
      )}

      {stepValue === 2 && (
        <Button onClick={addNewOperator}>Add New Operator</Button>
      )}

      {stepValue !== 2 ? (
        <Button
          onClick={() => {
            if (stepValue !== 2) {
              setStepValue(stepValue + 1);
            }
          }}
        >
          Next
        </Button>
      ) : (
        <Button onClick={submitForm}>Submit</Button>
      )}
    </Box>
  );
}
