import {
  Box, Button, Typography, IconButton, FormControl,
} from '@mui/material';
import { DeleteForever } from '@mui/icons-material';
import { FieldArray, useFormikContext } from 'formik';
import _ from 'lodash';
import { FormikTextInput } from '../../../form-inputs/FormikTextInput';
import { FormikSelectInput } from '../../../form-inputs/FormikSelectInput';
import { createEmptyMutation } from '../../../../lib/constants/v2_form/initialValues';

export default function MutationsTab({ fieldPrefix }) {
  const { values } = useFormikContext();
  const mutations = _.get(values, `${fieldPrefix}.mutations`, []);

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      rowGap={1}
      sx={{ height: '100%', mx: 3, mt: 3 }}
    >
      <Box gridColumn="span 12">
        <Typography sx={{ fontSize: { xs: 22, md: 26 }, mb: 1 }}>
          Mutations (optional)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          List point mutations from a reference protein, e.g. "L42A". Separate multiple
          mutations with commas (e.g. "L42A, K77R").
        </Typography>
      </Box>

      <FieldArray name={`${fieldPrefix}.mutations`}>
        {({ push, remove }) => (
          <>
            {mutations.map((_m, i) => (
              <Box
                key={i}
                gridColumn="span 12"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gap={1}
                alignItems="center"
                sx={{ mt: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
              >
                <Box gridColumn="span 11">
                  <Typography variant="caption" color="text.secondary">
                    Mutation set #{i + 1}
                  </Typography>
                </Box>
                <Box gridColumn="span 1" display="flex" justifyContent="flex-end">
                  <IconButton onClick={() => remove(i)} size="small">
                    <DeleteForever />
                  </IconButton>
                </Box>

                <Box gridColumn="span 12">
                  <FormikTextInput
                    name={`${fieldPrefix}.mutations.${i}.mutations`}
                    label="Mutations (comma-separated)"
                    placeholder="e.g. L42A, K77R"
                  />
                </Box>

                <Box gridColumn={{ xs: 'span 12', sm: 'span 4' }}>
                  <FormControl fullWidth>
                    <FormikSelectInput
                      name={`${fieldPrefix}.mutations.${i}.ref_type`}
                      label="Reference type"
                      options={['UniProt', 'groovDB']}
                    />
                  </FormControl>
                </Box>
                <Box gridColumn={{ xs: 'span 12', sm: 'span 8' }}>
                  <FormikTextInput
                    name={`${fieldPrefix}.mutations.${i}.ref_id`}
                    label="Reference protein ID"
                    placeholder="UniProt ID or groovDB entry ID"
                  />
                </Box>
              </Box>
            ))}
            <Box gridColumn="span 12" mt={2}>
              <Button onClick={() => push(createEmptyMutation())} variant="outlined" size="small">
                + Add mutation set
              </Button>
            </Box>
          </>
        )}
      </FieldArray>
    </Box>
  );
}
