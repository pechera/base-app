import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Axios } from '../services/Axios';
import { useMutation, MutationFunction } from 'react-query';
import toast, { Toaster } from 'react-hot-toast';

import styles from './styles/form.module.css';

import useValidationOptions from '../hooks/useValidationOptions';

import { IOneMessageResponse, RecoveryFormValues } from '../types/data';

const PasswordRecovery: React.FC = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RecoveryFormValues>({
        mode: 'onBlur',
    });

    const { validationEmailOptions } = useValidationOptions();

    const sendPasswordRequest: MutationFunction<IOneMessageResponse, RecoveryFormValues> = async (recoveryData) => {
        const { data } = await Axios.post('/api/recovery', recoveryData);

        return data;
    };

    const recoveryMutation = useMutation<IOneMessageResponse, unknown, RecoveryFormValues>(sendPasswordRequest, {
        onError: (error: any) => {
            toast.error(error.response.data.error);
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onSettled: () => reset(),
    });

    const submitPasswordRecovery = (data: RecoveryFormValues): void => {
        recoveryMutation.mutate(data);
    };

    return (
        <Container className={styles.auth_form__container}>
            <Form className={styles.auth_form} onSubmit={handleSubmit(submitPasswordRecovery)}>
                <div className={styles.auth_form__content}>
                    <h3 className={styles.auth_form__title}>Password recovery</h3>
                    <Form.Group className="mt-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            className={`form-control mt-1 ${errors.email && 'is-invalid'}`}
                            {...register('email', validationEmailOptions)}
                        />
                        {errors.email && <div className={styles.error_message}>{errors?.email.message}</div>}
                    </Form.Group>
                    <div className="d-grid gap-2 mt-3">
                        <Button type="submit" variant="primary">
                            Recovery password
                        </Button>
                    </div>
                    <p className="text-center mt-2">
                        Back to <Link to="/login">Login</Link>
                    </p>
                </div>
            </Form>
            <Toaster />
        </Container>
    );
};

export default PasswordRecovery;
