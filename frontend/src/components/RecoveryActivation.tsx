import React, { useState, useEffect, useRef } from 'react';
import Axios from '../services/Axios';
import { Container, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import styles from './styles/form.module.css';

type FormValues = {
    password: string;
    confirmPassword: string;
};

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
    } = useForm<FormValues>({
        mode: 'onBlur',
    });

    const password = watch('password');

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

    const sendPasswordData = async (data: {
        password: string;
    }): Promise<void> => {
        try {
            const response = await Axios.post('/api/password', {
                link,
                password,
            });

            if (response.data.message) {
                toast.success(response.data.message);
                navigate('/login'); // { replace: true }
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.error);
        }
    };

    const submitPasswordRecovery = (data: FormValues) => {
        const password = data.password;
        sendPasswordData({ password });
        reset();
    };

    return (
        <div className={styles.auth_form__container}>
            {isLinkValid ? (
                <Form
                    className={styles.auth_form}
                    onSubmit={handleSubmit(submitPasswordRecovery)}
                >
                    <div className={styles.auth_form__content}>
                        <h3 className={styles.auth_form__title}>
                            Enter new password
                        </h3>
                        <Form.Group className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="**********"
                                className={
                                    errors.password ||
                                    (errors.confirmPassword &&
                                        errors.confirmPassword.type ==
                                            'validate')
                                        ? 'form-control mt-1 is-invalid'
                                        : 'form-control mt-1'
                                }
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
                            {errors.password && (
                                <div className={styles.error_message}>
                                    {errors.password.message}
                                </div>
                            )}
                        </Form.Group>
                        <Form.Group className="mt-3">
                            <Form.Label>Password again</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="**********"
                                className={
                                    errors.confirmPassword
                                        ? 'form-control mt-1 is-invalid'
                                        : 'form-control mt-1'
                                }
                                {...register('confirmPassword', {
                                    required: 'Password is requared',
                                    minLength: {
                                        value: 5,
                                        message: 'Minimum 5 symbols',
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Maximum 50 symbols',
                                    },
                                    validate: (value) =>
                                        value === password ||
                                        'Passwords not match',
                                })}
                            />
                            {errors.confirmPassword && (
                                <div
                                    style={{
                                        color: 'red',
                                        fontSize: '12px',
                                        marginTop: '5px',
                                        paddingLeft: '5px',
                                    }}
                                >
                                    {errors.confirmPassword.message}
                                </div>
                            )}
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
