import { Box, Button, Typography, Switch, FormControlLabel } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import _ from 'lodash';
import OperatorCard from './cards/OperatorCard';
import { createEmptyOperator } from '../../../../lib/constants/v2_form/initialValues';

export default function OperatorTab({ fieldPrefix }) {
  const { values, setFieldValue } = useFormikContext();
  const operators = _.get(values, `${fieldPrefix}.operators`, []);
  const toggles = _.get(values, `${fieldPrefix}.toggles`, {});
  const isEnabled = toggles.operators !== false;

  function handleToggle(checked) {
    setFieldValue(`${fieldPrefix}.toggles.operators`, checked);
    if (!checked) {
      setFieldValue(`${fieldPrefix}.operators`, []);
    } else {
      setFieldValue(`${fieldPrefix}.operators`, [createEmptyOperator()]);
    }
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      rowGap={1}
      sx={{ height: '100%', mx: 3, mt: 3 }}
    >
      <Box gridColumn="span 12" display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography sx={{ fontSize: { xs: 22, md: 26 } }}>
          DNA-binding information
        </Typography>
      </Box>
      <Box gridColumn="span 12" mb={1}>
        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={(e) => handleToggle(e.target.checked)}
              color="primary"
            />
          }
          label="This protein has a DNA operator"
        />
      </Box>
      {isEnabled && (
        <FieldArray name={`${fieldPrefix}.operators`}>
          {({ push }) => (
            <>
              {operators.map((_item, index) => (
                <OperatorCard index={index} key={index} fieldPrefix={fieldPrefix} />
              ))}
              <Box gridColumn="span 12" mt={1}>
                <Button onClick={() => push(createEmptyOperator())} variant="outlined">
                  + Add another operator
                </Button>
              </Box>
            </>
          )}
        </FieldArray>
      )}
    </Box>
  );
}
