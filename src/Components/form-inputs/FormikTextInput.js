import { TextField } from '@mui/material';
import { useField } from 'formik';

export const FormikTextInput = ({ label, id = null, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      fullWidth
      label={label}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      {...field}
      {...props}
      {...(id && { id: id })}
    />
  );
};
