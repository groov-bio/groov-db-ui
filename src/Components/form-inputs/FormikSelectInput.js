import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useField } from 'formik';

export const FormikSelectInput = ({ label, options, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControl fullWidth error={meta.touched && !!meta.error}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} {...field} {...props}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {meta.touched && meta.error && (
        <FormHelperText>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};
