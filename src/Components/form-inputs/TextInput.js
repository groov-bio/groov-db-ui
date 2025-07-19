import React, { useEffect, useState, useRef } from 'react';

import { Controller } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import { useAddSensorStore } from './../../zustand/addSensor.store';

export default function TextInput({
  pattern,
  label,
  field,
  accessKey,
  index,
  style,
  maxLength = false,
  numRows = 1,
}) {
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const typeData = useAddSensorStore((state) => state[field]);
  // const updateFunc = index === null ? useAddSensorStore(state => state.updateField) : useAddSensorStore(state => state.updateArrayField);
  const updateField = useAddSensorStore((state) => state.updateField);
  const updateArrayField = useAddSensorStore((state) => state.updateArrayField);
  const currentFieldErrors = useAddSensorStore((state) => state.errors[field]);
  const insertFormApiState = useAddSensorStore((state) => state.insertFormApi);
  const addError = useAddSensorStore((state) => state.addError);
  const popError = useAddSensorStore((state) => state.popError);
  const errorString =
    index === undefined
      ? `${field}${accessKey}`
      : `${field}${index + 1}${accessKey}`;
  const isMaxLengthEnabled = maxLength ? { maxLength: 500 } : {};
  const thisRef = useRef(null);

  //Handle situation where error was added to error store but component mounts again
  useEffect(() => {
    if (
      typeData[label] === '' &&
      currentFieldErrors[errorString] !== undefined
    ) {
      popError(field, errorString);
    }
  }, []);

  useEffect(() => {
    if (insertFormApiState.status === 'success') {
      thisRef.current.value = null;
    }
  }, [insertFormApiState]);

  const validateField = (val) => {
    if (!val) {
      setIsEmpty(true);

      //Add isEmpty error
      if (
        !currentFieldErrors[errorString] ||
        currentFieldErrors[errorString] === 'isError'
      ) {
        addError(field, errorString, 'isEmpty');
      }
      return;
    } else {
      if (isEmpty) {
        setIsEmpty(false);
        popError(field, errorString);
      } else if (currentFieldErrors[errorString] === 'isEmpty') {
        //This should only be triggered when empty submit errors triggered
        popError(field, errorString);
      }
    }
    let result = pattern.test(val);

    if (!result) {
      setIsError(true);
      addError(field, errorString, 'isError');
    } else {
      if (isError) {
        setIsError(false);
        popError(field, errorString);
      }
    }
  };

  const helper = {
    message: {
      required: `${label} is required`,
      pattern: `Invalid ${label}.`,
    },
  };

  const getHelperText = () => {
    if (isEmpty || currentFieldErrors[errorString] === 'isEmpty') {
      return helper.message.required;
    } else if (isError || currentFieldErrors[errorString] === 'isError') {
      return helper.message.pattern;
    } else {
      return '';
    }
  };

  const getDefaultValue = () => {
    if (index === undefined) {
      if (typeData[accessKey]) {
        return typeData[accessKey];
      }
    } else {
      if (typeData[index][accessKey]) {
        return typeData[index][accessKey];
      }
    }

    return '';
  };

  //Notes - Error use cases
  //Field is empty -> need to track tab/field/#
  //Field is invalid -> need to track tab/field/#, purge is empty error
  //Field is valid -> purge all errors

  //Structure, k:v
  // {
  //   (String) uniqueId: (String) isEmptyOrInvalid
  // }

  return (
    <TextField
      fullWidth
      sx={style}
      label={label}
      key={accessKey}
      defaultValue={getDefaultValue()}
      inputRef={thisRef}
      onChange={(e) => {
        index === undefined
          ? updateField(field, accessKey, e.target.value)
          : updateArrayField(field, index, accessKey, e.target.value);
        validateField(e.target.value);
      }}
      error={
        isError || isEmpty || currentFieldErrors[errorString] !== undefined
      }
      helperText={getHelperText()}
      inputProps={isMaxLengthEnabled}
      rows={numRows}
      multiline={numRows !== 1 ? true : false}
    />
  );
}
