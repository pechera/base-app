import React, { useState, useRef } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Axios from '../services/Axios';
import toast, { Toaster } from 'react-hot-toast';

import styles from './styles/login.module.css';

type FormValues = {
    email: string;
};

const PasswordRecovery: React.FC = () => {
    // const email = useRef();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        mode: 'onBlur',
    });

    const sendPasswordRequest = async (data: FormValues): Promise<void> => {
        try {
            const response = await Axios.post('/api/recovery', data);

            console.log(response.data);

            if (response.data.error) {
                toast.error(response.data.error);
            }

            if (response.data.message) {
                toast.success(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const submitPasswordRecovery = (data: FormValues): void => {
        sendPasswordRequest(data);
        reset();
    };

    return (
        <Container className={styles.auth_form__container}>
            <Form
                className={styles.auth_form}
                onSubmit={handleSubmit(submitPasswordRecovery)}
            >
                <div className={styles.auth_form__content}>
                    <h3 className={styles.auth_form__title}>
                        Password recovery
                    </h3>
                    <Form.Group className="mt-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            className={
                                errors.email
                                    ? 'form-control mt-1 is-invalid'
                                    : 'form-control mt-1'
                            }
                            {...register('email', {
                                required: 'Email is requared',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                        />
                        {errors.email && (
                            <div
                                style={{
                                    color: 'red',
                                    fontSize: '12px',
                                    marginTop: '5px',
                                    paddingLeft: '5px',
                                }}
                            >
                                {errors?.email.message}
                            </div>
                        )}
                    </Form.Group>
                    <div className="d-grid gap-2 mt-3">
                        <Button type="submit" variant="primary">
                            Recovery password
                        </Button>
                    </div>
                    <p className="text-center mt-2">
                        Back to <a href="/login">login</a>
                    </p>
                </div>
            </Form>
            <Toaster />
        </Container>
    );
};

export default PasswordRecovery;
