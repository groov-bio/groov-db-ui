import { TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';

export const FormikTextInput = ({ label, id = null, ...props }) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext();
  const showError = (meta.touched || submitCount > 0) && !!meta.error;

  return (
    <TextField
      fullWidth
      label={label}
      error={showError}
      helperText={showError ? meta.error : undefined}
      {...field}
      {...props}
      {...(id && { id: id })}
    />
  );
};
