import React, { useState, useEffect } from 'react';
import { Axios } from '../services/Axios';
import { Form, Button } from 'react-bootstrap';
import { RegisterOptions, useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useMutation, MutationFunction } from 'react-query';

import styles from './styles/form.module.css';

import useValidationOptions from '../hooks/useValidationOptions';

import { IRecoveryActivationSendData, IRecoveryActiationFormValues, IOneMessageResponse } from '../types/data';

const RecoveryActivation: React.FC = () => {
    const { link } = useParams();
    const navigate = useNavigate();

    const [isLinkValid, setIsLinkValid] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<IRecoveryActiationFormValues>({
        mode: 'onBlur',
    });

    const password = watch('password');

    const { validationPasswordOptions } = useValidationOptions();

    useEffect(() => {
        (async () => {
            try {
                const response = await Axios.post('/api/password/is', {
                    link,
                });

                if (response.data.link) {
                    setIsLinkValid(true);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const sendPasswordData: MutationFunction<IOneMessageResponse, IRecoveryActivationSendData> = async (activationData) => {
        const { data } = await Axios.post('/api/password', activationData);
        return data;
    };

    const passwordActivationMutation = useMutation<IOneMessageResponse, unknown, IRecoveryActivationSendData>(sendPasswordData, {
        onError: (error: any) => {
            console.log(error);
            toast.error(error.response.data.error);
        },
        onSuccess: (data) => {
            console.log(data);
            toast.success(data.message);
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 1500);
        },
        onSettled: () => reset(),
    });

    const submitPasswordRecovery = (data: IRecoveryActiationFormValues) => {
        const password = data.password;
        const recoveryData: IRecoveryActivationSendData = {
            link: link as string,
            password,
        };
        passwordActivationMutation.mutate(recoveryData);
    };

    return (
        <div className={styles.auth_form__container}>
            {isLinkValid ? (
                <Form className={styles.auth_form} onSubmit={handleSubmit(submitPasswordRecovery)}>
                    <div className={styles.auth_form__content}>
                        <h3 className={styles.auth_form__title}>Enter new password</h3>
                        <Form.Group className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="**********"
                                className={`form-control mt-1 ${errors.password || (errors.confirmPassword?.type == 'validate' && 'is-invalid')}`}
                                {...register('password', validationPasswordOptions)}
                            />
                            {errors.password && <div className={styles.error_message}>{errors.password.message}</div>}
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Password again</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="**********"
                                className={`form-control mt-1 ${errors.confirmPassword && 'is-invalid'}`}
                                {...register('confirmPassword', {
                                    ...validationPasswordOptions,
                                    validate: (value) => value === password || 'Passwords not match',
                                })}
                            />
                            {errors.confirmPassword && <div className={styles.error_message}>{errors.confirmPassword.message}</div>}
                        </Form.Group>
                        <div className="d-grid gap-2 mt-4">
                            <Button type="submit" variant="primary">
                                Send
                            </Button>
                        </div>
                    </div>
                </Form>
            ) : (
                <p>Link not found or expired. Try again.</p>
            )}
            <Toaster />
        </div>
    );
};

export default RecoveryActivation;
