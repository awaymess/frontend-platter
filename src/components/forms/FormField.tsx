'use client';

import { type FieldError } from 'react-hook-form';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

interface FormFieldProps extends Omit<TextFieldProps, 'error'> {
  error?: FieldError;
}

export function FormField({ error, helperText, ...props }: FormFieldProps) {
  return (
    <FormControl fullWidth error={!!error}>
      <TextField {...props} error={!!error} helperText={error?.message || helperText} />
    </FormControl>
  );
}
