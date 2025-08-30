import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import TurnstileWidget from '../form-inputs/TurnstileWidget';

export default function Contact() {
  const [status, setStatus] = useState(null);

  const initialValues = {
    name: '',
    email: '',
    message: '',
    turnstileToken: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    message: Yup.string().required('Message is required'),
    turnstileToken: Yup.string().required('Please complete the CAPTCHA'),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const response = await fetch('https://api.groov.bio/contact_form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setStatus('Message sent successfully!');
        resetForm();
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        marginLeft: {
          xs: '10vw',
          sm: '35vw',
          md: '35vw',
          lg: '35vw',
          xl: '17vw',
        },
        marginRight: { xs: '3vw', sm: '5vw', md: '5vw', lg: '17vw' },
      }}
    >
      <Typography
        sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }}
        fontWeight="300"
        gutterBottom
        id="about-contact-us-header"
      >
        Contact Us
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form>
            <Field
              as={TextField}
              name="name"
              label="Name"
              fullWidth
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              id="contact-form-name"
            />
            <Field
              as={TextField}
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              id="contact-form-email"
            />
            <Field
              as={TextField}
              name="message"
              label="Message"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              error={touched.message && Boolean(errors.message)}
              helperText={touched.message && errors.message}
              id="contact-form-message"
            />

            <Box sx={{ my: 2 }}>
              <TurnstileWidget
                name="turnstileToken"
                siteKey="0x4AAAAAABOSb9jib0OgNJ2S"
              />
              {touched.turnstileToken && errors.turnstileToken && (
                <Typography color="error" variant="caption">
                  {errors.turnstileToken}
                </Typography>
              )}
            </Box>

            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              sx={{ mt: 2 }}
              id="contact-send-button"
            >
              Send
            </Button>
          </Form>
        )}
      </Formik>
      {status && <Typography sx={{ mt: 2 }} id="contact-message-status">{status}</Typography>}
    </Box>
  );
}
