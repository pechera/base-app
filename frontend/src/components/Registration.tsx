import React from 'react';
import { Axios } from '../services/Axios';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, MutationFunction } from 'react-query';
import toast, { Toaster } from 'react-hot-toast';

import GoogleAuth from './GoogleAuth';

import useUserHook from '../hooks/useUserHook';
import useValidationOptions from '../hooks/useValidationOptions';

import styles from './styles/form.module.css';

import useUserStore from '../store/Store';

import { IRegisterFormValues, ILoginResponseData } from '../types/data';

const Registration: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams({});
    const navigate = useNavigate();

    const { isAuth } = useUserStore();

    const { loginUserService } = useUserHook();
    const { validationNameOptions, validationEmailOptions, validationPasswordOptions } = useValidationOptions();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IRegisterFormValues>({
        mode: 'onBlur',
    });

    const sendRegistrationData: MutationFunction<ILoginResponseData, IRegisterFormValues> = async (registerData) => {
        const { data } = await Axios.post(
            '/api/registration',

            registerData
        );

        return data;
    };

    const registrationMutation = useMutation<ILoginResponseData, unknown, IRegisterFormValues>(sendRegistrationData, {
        onError: (error: any) => {
            console.log(error);
            toast.error(error.response.data.error);
        },
        onSuccess: (data) => {
            const loginData = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                username: data.username,
            };

            loginUserService(loginData);

            const redirect = searchParams.get('redirect');

            redirect ? navigate(redirect, { replace: true }) : navigate('/dashboard', { replace: true });
        },
        onSettled: () => {
            console.log('onSettled');
            reset();
        },
    });

    const setErrorHandler = (error: any) => {
        toast.error(error.message);
    };

    const submitHandler = (registerData: IRegisterFormValues): void => {
        registrationMutation.mutate(registerData);
    };

    if (isAuth) {
        return <Navigate to="/dashboard" />;
    }
    return (
        <div className={styles.auth_form__container}>
            <form className={styles.auth_form} onSubmit={handleSubmit(submitHandler)}>
                <div className={styles.auth_form__content}>
                    <h3 className={styles.auth_form__title}>Sign Up</h3>
                    <div className="form-group mt-3">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className={`form-control mt-1 ${errors.name && 'is-invalid'}`}
                            placeholder="e.g Jane Doe"
                            {...register('name', validationNameOptions)}
                        />
                        {errors.name && <div className={styles.error_message}>{errors.name.message}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className={`form-control mt-1 ${errors.email && 'is-invalid'}`}
                            placeholder="Enter email"
                            {...register('email', validationEmailOptions)}
                        />
                        {errors.email && <div className={styles.error_message}>{errors.email.message}</div>}
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className={`form-control mt-1 ${errors.password && 'is-invalid'}`}
                            placeholder="Enter password"
                            {...register('password', validationPasswordOptions)}
                        />
                        {errors.password && <div className={styles.error_message}>{errors.password.message}</div>}
                    </div>
                    <div className="d-grid gap-2 mt-4">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="font-weight-light text-center text-secondary my-3">or</p>
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
