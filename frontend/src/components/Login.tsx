import React from 'react';
import { Axios } from '../services/Axios';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Row, Col } from 'react-bootstrap';
import { RegisterOptions, useForm } from 'react-hook-form';
import { useMutation, MutationFunction } from 'react-query';
import toast, { Toaster } from 'react-hot-toast';

import GoogleAuth from './GoogleAuth';

import useUserStore from '../store/Store';

import styles from './styles/form.module.css';

import useUserHook from '../hooks/useUserHook';

import { FormValues, LoginResponseData } from '../types/data';

const Login: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const navigate = useNavigate();

    const { isAuth } = useUserStore();

    const { loginUserService } = useUserHook();

    const {
        register,
        handleSubmit,
        reset,
        resetField,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onBlur',
    });

    const validationEmailOptions: RegisterOptions = {
        required: 'Email is requared',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
        },
    };

    const validationPasswordOptions: RegisterOptions = {
        required: 'Password is requared',
        minLength: {
            value: 5,
            message: 'Minimum 5 symbols',
        },
        maxLength: {
            value: 50,
            message: 'Maximum 50 symbols',
        },
    };

    const sendLoginData: MutationFunction<
        LoginResponseData,
        FormValues
    > = async (loginFormData) => {
        const { data } = await Axios.post('/api/login', loginFormData);

        return data;
    };

    const loginMutation = useMutation<LoginResponseData, unknown, FormValues>(
        sendLoginData,
        {
            onError: (error: any) => {
                console.log('error');
                toast.error(error.response.data.error);

                error.response.data.error === 'Incorrect password'
                    ? resetField('password')
                    : reset();
            },
            onSuccess: (data) => {
                console.log('success');
                const loginData = {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    username: data.username,
                };

                loginUserService(loginData);

                const redirect = searchParams.get('redirect');

                redirect
                    ? navigate(redirect, { replace: true })
                    : navigate('/dashboard', { replace: true });
            },
        }
    );

    const setErrorHandler = (error: any): void => {
        toast.error(error.message);
    };

    const submitHandler = (loginFormData: FormValues): void => {
        loginMutation.mutate(loginFormData);
    };

    if (isAuth) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className={styles.auth_form__container}>
            <form
                className={styles.auth_form}
                onSubmit={handleSubmit(submitHandler)}
            >
                <div className={styles.auth_form__content}>
                    <h3 className={styles.auth_form__title}>Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className={`form-control mt-1 ${
                                errors.email && 'is-invalid'
                            }`}
                            placeholder="Enter email"
                            {...register('email', validationEmailOptions)}
                        />
                        {errors.email && (
                            <div className={styles.error_message}>
                                {errors.email.message}
                            </div>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className={`form-control mt-1 ${
                                errors.password && 'is-invalid'
                            }`}
                            placeholder="Enter password"
                            {...register('password', validationPasswordOptions)}
                        />

                        <Row>
                            <Col>
                                {errors.password && (
                                    <div className={styles.error_message}>
                                        {errors.password.message}
                                    </div>
                                )}
                            </Col>
                            <Col>
                                <Form.Text className="d-flex text-muted justify-content-end">
                                    <span style={{ fontSize: '12px' }}>
                                        Forgot{' '}
                                        <Link to="/recovery">password?</Link>
                                    </span>
                                </Form.Text>
                            </Col>
                        </Row>
                    </div>
                    <div className="d-grid gap-2 mt-4">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="font-weight-light text-center text-secondary my-3">
                            or
                        </p>
                        <GoogleAuth setError={setErrorHandler} />
                    </div>
                    <div className="text-center mt-3">
                        <span className="link">Don't have an account? </span>
                        <Link to="/registration">Sign Up</Link>
                    </div>
                </div>
            </form>
            <Toaster />
        </div>
    );
};

export default Login;
