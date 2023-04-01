import React from 'react';
import Axios from '../services/Axios';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import GoogleAuth from './GoogleAuth';

import styles from './styles/form.module.css';

type FormValues = {
    name: string;
    email: string;
    password: string;
};

const Registration: React.FC = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onBlur',
    });

    const setErrorHandler = (error: any) => {
        toast.error(error.message);
    };

    const sendRegistrationData = async (data: FormValues): Promise<void> => {
        try {
            const response = await Axios.post(
                '/api/registration',

                data
            );

            const { accessToken, refreshToken } = response.data;

            if (accessToken && refreshToken) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                navigate('/dashboard');
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    };

    const submitHandler = (data: FormValues) => {
        sendRegistrationData(data);
        reset();
    };
    return (
        <div className={styles.auth_form__container}>
            <form
                className={styles.auth_form}
                onSubmit={handleSubmit(submitHandler)}
            >
                <div className={styles.auth_form__content}>
                    <h3 className={styles.auth_form__title}>Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className={
                                errors.name
                                    ? 'form-control mt-1 is-invalid'
                                    : 'form-control mt-1'
                            }
                            placeholder="e.g Jane Doe"
                            {...register('name', {
                                required: 'Name is requared',
                                minLength: {
                                    value: 2,
                                    message: 'Minimum 3 symbols',
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'Maximum 50 symbols',
                                },
                            })}
                        />
                        {errors.name && (
                            <div className={styles.error_message}>
                                {errors.name.message}
                            </div>
                        )}
                    </div>
                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className={
                                errors.email
                                    ? 'form-control mt-1 is-invalid'
                                    : 'form-control mt-1'
                            }
                            placeholder="Enter email"
                            {...register('email', {
                                required: 'Email is requared',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
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
                            className={
                                errors.password
                                    ? 'form-control mt-1 is-invalid'
                                    : 'form-control mt-1'
                            }
                            placeholder="Enter password"
                            {...register('password', {
                                required: 'Password is requared',
                                minLength: {
                                    value: 5,
                                    message: 'Minimum 5 symbols',
                                },
                                maxLength: {
                                    value: 50,
                                    message: 'Maximum 50 symbols',
                                },
                            })}
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
                        Already registered?{' '}
                        <span className="link-primary">
                            <Link to="/login">Sign In</Link>
                        </span>
                    </div>
                </div>
            </form>
            <Toaster />
        </div>
    );
};

export default Registration;
