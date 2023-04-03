import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { axiosInstance } from '../../services/Axios';
import { useForm } from 'react-hook-form';
import { useMutation, MutationFunction } from 'react-query';
import toast, { Toaster } from 'react-hot-toast';

import styles from './styles/profile.module.css';

import useValidationOptions from '../../hooks/useValidationOptions';

import { IChangeModalProps, RecoveryFormValues, IOneMessageResponse } from '../../types/data';

const EmailModal: React.FC<IChangeModalProps> = ({ hideModal, showModal }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RecoveryFormValues>({
        mode: 'onBlur',
    });

    const { validationEmailOptions } = useValidationOptions();

    const sendChangeEmail: MutationFunction<IOneMessageResponse, RecoveryFormValues> = async (emailData) => {
        const { data } = await axiosInstance.post('/api/profile/email', emailData);
        return data;
    };

    const changeEmailMutation = useMutation<IOneMessageResponse, unknown, RecoveryFormValues>(sendChangeEmail, {
        onMutate: () => {
            toast.loading('Changing email...', {
                id: 'emailLoad',
            });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message, {
                id: 'emailLoad',
            });
        },
        onSuccess: (data) => {
            toast.success(data.message, {
                id: 'emailLoad',
            });
            setTimeout(() => hideModal(), 1500);
        },
        onSettled: () => {
            reset();
        },
    });

    const changeEmailHandler = async (data: RecoveryFormValues) => {
        changeEmailMutation.mutate(data);
    };

    return (
        <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" show={showModal} onHide={hideModal} centered>
            <Form onSubmit={handleSubmit(changeEmailHandler)}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Enter new email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mt-3" controlId="formEmail">
                        <Form.Control
                            type="text"
                            placeholder="Email"
                            className={`form-control mt-1 ${errors.email && 'is-invalid'}`}
                            {...register('email', validationEmailOptions)}
                        />
                        {errors.email && <div className={styles.error_message}>{errors.email.message}</div>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hideModal}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Save changes
                    </Button>
                </Modal.Footer>
            </Form>
            <Toaster />
        </Modal>
    );
};

export default EmailModal;
