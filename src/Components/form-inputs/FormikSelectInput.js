import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useField, useFormikContext } from 'formik';

export const FormikSelectInput = ({ label, options, ...props }) => {
  const [field, meta] = useField(props);
  const { submitCount } = useFormikContext();
  const showError = submitCount > 0 && !!meta.error;

  return (
    <FormControl fullWidth size="small" error={showError}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} {...field} {...props}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      {showError && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};
