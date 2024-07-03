
// Login.js
import React from 'react';
import { Button, Grid, Typography, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/userSlice';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = (userData) => {
    dispatch(loginUser(userData))
      .unwrap()
      .then(() => {
        localStorage.setItem('isLoggedIn', true);
        navigate('/dashboard');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const loginValidationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  });

  return (
    <Grid container className='h-screen w-full'>
      <Grid item xs={12} sm={12} md={6}>
        <img src='assets/login2.jpg' className='object-cover object-center w-full h-full' alt='Login' />
      </Grid>
      <Grid item xs={12} sm={12} md={6} className='flex justify-center items-center'>
        <Grid container justifyContent='center' alignItems='center' className='w-full ' padding={5}>
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            validationSchema={loginValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleLogin(values);
              setSubmitting(false);
            }}
          >
            {(formik) => (
              <Form className='w-full sm:w-2/3 md:w-3/5'>
                <Grid item container justifyContent='center' alignItems='center'>
                  <Typography variant='h5' className='text-lg'>
                    Login
                  </Typography>
                </Grid>
                <TextField
                  required
                  name='email'
                  placeholder='Email'
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  id='email'
                  label='Email'
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  required
                  name='password'
                  placeholder='Password'
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  id='password'
                  label='Password'
                  type='password'
                  fullWidth
                  margin='normal'
                />
                <Button
                  sx={{
                    backgroundColor: '#818cf8',
                    marginTop: 2,
                    '&:hover': {
                      backgroundColor: '#818cf8',
                      color: '#fff',
                    },
                  }}
                  type='submit'
                  variant='contained'
                  color='primary'
                  disabled={formik.isSubmitting}
                  fullWidth
                >
                  Login
                </Button>
                <Grid item container justifyContent='center' alignItems='center'>
                  <span>Don't Have an Account?</span>
                  <Link to='/register' style={{ color: '#818cf8', fontWeight: 'bold', marginTop: 3 }}>
                    {' '}
                    Register
                  </Link>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;

