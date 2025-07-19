import React from 'react';

import { Controller } from 'react-hook-form';

import TextField from '@mui/material/TextField';

export default function FullWidthTextInput(props) {
  const helper = {
    message: {
      required: `${props.inputName} is required`,
      pattern: `Invalid ${props.inputName}`,
    },
  };

  return (
    <Controller
      name={props.inputName}
      control={props.control}
      defaultValue=""
      rules={{
        required: true,
        pattern: props.validationPattern,
      }}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          id={props.inputId}
          label={props.inputLabel}
          // is error?
          error={error !== undefined}
          // show helper text if it is invalid
          helperText={error ? helper.message[error.type] : ''}
        />
      )}
    />
  );
}
