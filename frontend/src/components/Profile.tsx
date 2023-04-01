import React, { useState, useEffect } from 'react';
import NavBar from './partials/NavBar';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import axiosInstance from '../services/axiosInstance';
import {
    useQueryClient,
    useQuery,
    useMutation,
    MutationFunction,
} from 'react-query';
import { useForm } from 'react-hook-form';
import toast, { Toast, Toaster } from 'react-hot-toast';

interface IProfile {
    name: string;
    email: string;
    activated: boolean;
}

import {
    RecoveryActiationFormValues,
    RecoveryActivationDataSender,
} from '../types/data';
import PasswordRecovery from './PasswordRecovery';

interface IChangePassword {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

interface IPasswordsToSend {
    currentPassword: string;
    newPassword: string;
}

interface IPaswordsResponse {
    message: string;
}

const Profile: React.FC = () => {
    const [email, setEmail] = useState<string>('');

    const [changeEmail, setChangeEmail] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<IChangePassword>({
        mode: 'onBlur',
    });

    const currentPassword = watch('currentPassword');
    const newPassword = watch('newPassword');

    const isDisabled: boolean =
        currentPassword === undefined || currentPassword.length < 5;

    const getProfileData = async () => {
        const { data } = await axiosInstance.get<IProfile>('/api/profile');
        return data;
    };

    const { isLoading, error, data } = useQuery('profile', getProfileData);

    const sendChangePassword: MutationFunction<
        IPaswordsResponse,
        IPasswordsToSend
    > = async (passwordsData) => {
        const { data } = await axiosInstance.post(
            '/api/profile/password',
            passwordsData
        );

        return data;
    };

    const changePasswordMutation = useMutation<
        IPaswordsResponse,
        unknown,
        IPasswordsToSend
    >((data) => sendChangePassword(data), {
        onMutate: () => {
            toast.loading('Changing password...', {
                id: 'load',
            });
        },
        onError: (error: any) => {
            toast.error(error.response.data.message, {
                id: 'load',
            });
        },
        onSuccess: (response) => {
            toast.success(response.message, {
                id: 'load',
            });
            setChangePassword(false);
        },
        onSettled: () => {
            reset();
        },
    });

    const changePasswordHandler = (data: IChangePassword): void => {
        const currentPassword = data.currentPassword;
        const newPassword = data.newPassword;

        changePasswordMutation.mutate({ currentPassword, newPassword });
    };

    return (
        <div>
            <NavBar />
            <Container className="p-3">
                <h1>Profile</h1>
                {/* {error && <div>Error: {error.message}</div>} */}
                {isLoading && <div>Loading...</div>}
                {data && (
                    <Form className="p-2 mt-3">
                        <Form.Group className="mt-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <div>{data.name}</div>
                        </Form.Group>
                        <Form.Group className="mt-3" controlId="formEmail">
                            <Form.Label>
                                {changeEmail ? (
                                    <>Enter new email</>
                                ) : (
                                    <>Email</>
                                )}
                            </Form.Label>
                            {changeEmail ? (
                                <>
                                    <Form.Control
                                        type="text"
                                        placeholder="Email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </>
                            ) : (
                                <div>
                                    <span>{data.email}</span>{' '}
                                    {data.activated ? (
                                        <span
                                            style={{
                                                color: 'lightgrey',
                                                fontSize: '12px',
                                            }}
                                        >
                                            activated
                                        </span>
                                    ) : (
                                        <span
                                            style={{
                                                color: 'lightgrey',
                                                fontSize: '12px',
                                            }}
                                        >
                                            not activated
                                        </span>
                                    )}
                                </div>
                            )}
                            <div
                                onClick={() => setChangeEmail((prev) => !prev)}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginTop: '5px',
                                }}
                            >
                                Change email
                            </div>
                        </Form.Group>
                        <Modal
                            show={changePassword}
                            onHide={() => setChangePassword(false)}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered
                        >
                            <Form
                                onSubmit={handleSubmit(changePasswordHandler)}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Change password</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <Form.Group
                                        className="mt-3"
                                        controlId="formCurrentPassword"
                                    >
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="********"
                                            className={
                                                errors.currentPassword
                                                    ? 'form-control mt-1 is-invalid'
                                                    : 'form-control mt-1'
                                            }
                                            {...register('currentPassword', {
                                                required:
                                                    'Password is requared',
                                                minLength: {
                                                    value: 5,
                                                    message:
                                                        'Minimum 5 symbols',
                                                },
                                                maxLength: {
                                                    value: 50,
                                                    message:
                                                        'Maximum 50 symbols',
                                                },
                                            })}
                                        />
                                        {errors.currentPassword && (
                                            <div
                                                style={{
                                                    color: 'red',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {errors.currentPassword.message}
                                            </div>
                                        )}
                                    </Form.Group>
                                    <fieldset disabled={isDisabled}>
                                        <Form.Group
                                            className="mt-3"
                                            controlId="formNewPassword"
                                        >
                                            <Form.Label>
                                                New password
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="********"
                                                className={
                                                    (!isDisabled &&
                                                        errors.newPassword) ||
                                                    (errors.newPasswordConfirm &&
                                                        errors
                                                            .newPasswordConfirm
                                                            .type == 'validate')
                                                        ? 'form-control mt-1 is-invalid'
                                                        : 'form-control mt-1'
                                                }
                                                {...register('newPassword', {
                                                    required:
                                                        'Password is requared',
                                                    minLength: {
                                                        value: 5,
                                                        message:
                                                            'Minimum 5 symbols',
                                                    },
                                                    maxLength: {
                                                        value: 50,
                                                        message:
                                                            'Maximum 50 symbols',
                                                    },
                                                })}
                                            />
                                            {!isDisabled &&
                                                errors.newPassword && (
                                                    <div
                                                        style={{
                                                            color: 'red',
                                                            fontSize: '12px',
                                                        }}
                                                    >
                                                        {
                                                            errors.newPassword
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                        </Form.Group>
                                        <Form.Group
                                            className="mt-3"
                                            controlId="formNewPasswordConfirm"
                                        >
                                            <Form.Label>
                                                Confirm Password
                                            </Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="********"
                                                className={
                                                    !isDisabled &&
                                                    errors.newPasswordConfirm
                                                        ? 'form-control mt-1 is-invalid'
                                                        : 'form-control mt-1'
                                                }
                                                {...register(
                                                    'newPasswordConfirm',
                                                    {
                                                        required:
                                                            'Password is requared',
                                                        minLength: {
                                                            value: 5,
                                                            message:
                                                                'Minimum 5 symbols',
                                                        },
                                                        maxLength: {
                                                            value: 50,
                                                            message:
                                                                'Maximum 50 symbols',
                                                        },
                                                        validate: (value) =>
                                                            value ===
                                                                newPassword ||
                                                            'Passwords not match',
                                                    }
                                                )}
                                            />
                                            {!isDisabled &&
                                                errors.newPasswordConfirm && (
                                                    <div
                                                        style={{
                                                            color: 'red',
                                                            fontSize: '12px',
                                                        }}
                                                    >
                                                        {
                                                            errors
                                                                .newPasswordConfirm
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                        </Form.Group>
                                    </fieldset>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setChangePassword(false)}
                                    >
                                        Close
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        Save changes
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        </Modal>
                        <div
                            className="mt-3"
                            onClick={() => setChangePassword(true)}
                            style={{ cursor: 'pointer' }}
                        >
                            Change password
                        </div>
                        <Button
                            variant="primary"
                            type="submit"
                            className="mt-3"
                        >
                            Save
                        </Button>
                    </Form>
                )}
                <Toaster />
            </Container>
        </div>
    );
};

export default Profile;
