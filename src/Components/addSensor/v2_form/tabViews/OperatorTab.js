import { Box, Button, Typography } from '@mui/material';
import { FieldArray, useFormikContext } from 'formik';
import _ from 'lodash';
import OperatorCard from './cards/OperatorCard';
import { createEmptyOperator } from '../../../../lib/constants/v2_form/initialValues';

export default function OperatorTab({ fieldPrefix }) {
  const { values } = useFormikContext();
  const operators = _.get(values, `${fieldPrefix}.operators`, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      rowGap={1}
      sx={{ height: '100%', mx: 3, mt: 3 }}
    >
      <Box gridColumn="span 12" display="flex">
        <Typography sx={{ fontSize: { xs: 22, md: 26 }, mb: 1 }}>
          DNA-binding information
        </Typography>
      </Box>
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
    </Box>
  );
}
