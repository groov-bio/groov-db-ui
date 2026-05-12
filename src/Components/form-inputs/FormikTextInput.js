import { TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';

export const FormikTextInput = ({ label, id = null, ...props }) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext();
  // Hold errors until the user actually tries to submit. Once they have,
  // Formik marks every field touched and validateOnBlur keeps them current.
  const showError = submitCount > 0 && !!meta.error;

  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      {...field}
      {...props}
      error={showError}
      helperText={showError ? meta.error : props.helperText}
      {...(id && { id: id })}
    />
  );
};
