import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useMutation, MutationFunction } from 'react-query';
import toast, { Toaster } from 'react-hot-toast';
import { axiosInstance } from '../../services/Axios';

import styles from './styles/profile.module.css';

import useValidationOptions from '../../hooks/useValidationOptions';

import { IChangePassword, IOneMessageResponse, IPasswordsToSend } from '../../types/data';

interface IChangePasswordProps {
    hideModal: () => void;
    showModal: boolean;
}

const PasswordModal: React.FC<IChangePasswordProps> = ({ hideModal, showModal }) => {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<IChangePassword>({
        mode: 'onBlur',
    });

    const { validationPasswordOptions } = useValidationOptions();

    const currentPassword = watch('currentPassword');
    const newPassword = watch('newPassword');

    const isDisabled: boolean = currentPassword === undefined || currentPassword.length < 5;

    const sendChangePassword: MutationFunction<IOneMessageResponse, IPasswordsToSend> = async (passwordsData) => {
        const { data } = await axiosInstance.post('/api/profile/password', passwordsData);

        return data;
    };

    const changePasswordMutation = useMutation<IOneMessageResponse, unknown, IPasswordsToSend>((data) => sendChangePassword(data), {
        onMutate: () => {
            toast.loading('Changing password...', {
                id: 'passLoad',
            });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message, {
                id: 'passLoad',
            });
        },
        onSuccess: (response) => {
            toast.success(response.message, {
                id: 'passLoad',
            });
            setTimeout(() => hideModal(), 1500);
        },
        onSettled: () => reset(),
    });

    const changePasswordHandler = (data: IChangePassword): void => {
        const currentPassword = data.currentPassword;
        const newPassword = data.newPassword;

        changePasswordMutation.mutate({ currentPassword, newPassword });
    };

    return (
        <Modal show={showModal} onHide={hideModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Form onSubmit={handleSubmit(changePasswordHandler)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change password</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Group className="mt-3" controlId="formCurrentPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="********"
                            className={`form-control mt-1 ${errors.currentPassword && 'is-invalid'}`}
                            {...register('currentPassword', validationPasswordOptions)}
                        />
                        {errors.currentPassword && <div className={styles.error_message}>{errors.currentPassword.message}</div>}
                    </Form.Group>
                    <fieldset disabled={isDisabled}>
                        <Form.Group className="mt-3" controlId="formNewPassword">
                            <Form.Label>New password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="********"
                                className={`form-control mt-1 ${
                                    (!isDisabled && errors.newPassword) || (errors.newPasswordConfirm?.type == 'validate' && 'is-invalid')
                                }`}
                                {...register('newPassword', validationPasswordOptions)}
                            />
                            {!isDisabled && errors.newPassword && <div className={styles.error_message}>{errors.newPassword.message}</div>}
                        </Form.Group>
                        <Form.Group className="mt-3" controlId="formNewPasswordConfirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="********"
                                className={`form-control mt-1 ${!isDisabled && errors.newPasswordConfirm && 'is-invalid'}`}
                                {...register('newPasswordConfirm', {
                                    ...validationPasswordOptions,
                                    validate: (value) => value === newPassword || 'Passwords not match',
                                })}
                            />
                            {!isDisabled && errors.newPasswordConfirm && <div className={styles.error_message}>{errors.newPasswordConfirm.message}</div>}
                        </Form.Group>
                    </fieldset>
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

export default PasswordModal;
