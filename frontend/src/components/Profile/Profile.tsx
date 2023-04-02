import React, { useState } from 'react';
import NavBar from '../partials/NavBar';
import { Container, Form, Button } from 'react-bootstrap';
import { axiosInstance } from '../../services/Axios';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, MutationFunction } from 'react-query';
import toast, { Toaster } from 'react-hot-toast';

import styles from './styles/profile.module.css';

import useValidationOptions from '../../hooks/useValidationOptions';

import { IProfile, RecoveryFormValues, IOneMessageResponse } from '../../types/data';

import PasswordModal from './PasswordModal';

const getProfileData = async () => {
    const { data } = await axiosInstance.get<IProfile>('/api/profile');

    return data;
};

const Profile: React.FC = () => {
    const [changeEmail, setChangeEmail] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RecoveryFormValues>({
        mode: 'onBlur',
    });

    const { validationEmailOptions } = useValidationOptions();

    const { isLoading, error, data } = useQuery('profile', getProfileData);

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
            setTimeout(() => setChangeEmail(false), 1500);
        },
        onSettled: () => reset(),
    });

    const changeEmailHandler = async (data: RecoveryFormValues) => {
        changeEmailMutation.mutate(data);
    };

    if (error) toast.error('Something went wrong');

    return (
        <div>
            <NavBar />
            <Container className="p-3">
                <h1>Profile</h1>
                {isLoading && <div>Loading...</div>}
                {data && (
                    <>
                        <Form className="p-2 mt-3" onSubmit={handleSubmit(changeEmailHandler)}>
                            <Form.Group className="mt-3" controlId="formUsername">
                                <Form.Label>Username</Form.Label>
                                <div>{data.name}</div>
                            </Form.Group>
                            <Form.Group className="mt-3" controlId="formEmail">
                                <Form.Label>{changeEmail ? <>Enter new email</> : <>Email</>}</Form.Label>
                                {changeEmail ? (
                                    <>
                                        <Form.Control
                                            type="text"
                                            placeholder="Email"
                                            // value={data.email}
                                            className={`form-control mt-1 ${errors.email && 'is-invalid'}`}
                                            {...register('email', validationEmailOptions)}
                                        />
                                        {errors.email && <div className={styles.error_message}>{errors?.email.message}</div>}
                                    </>
                                ) : (
                                    <div>
                                        <span>{data.email}</span>{' '}
                                        {data.activated ? (
                                            <span className={styles.activated}>activated</span>
                                        ) : (
                                            <span className={styles.activated}>not activated</span>
                                        )}
                                    </div>
                                )}
                                {data.register_method === undefined && (
                                    <div onClick={() => setChangeEmail((prev) => !prev)} className={styles.change_label}>
                                        Change email
                                    </div>
                                )}
                            </Form.Group>

                            {data.register_method === undefined ? (
                                <div className="mt-3" onClick={() => setChangePassword(true)} style={{ cursor: 'pointer' }}>
                                    Change password
                                </div>
                            ) : (
                                <div className="mt-3">You registered with Google</div>
                            )}

                            <Button variant="primary" type="submit" className="mt-3">
                                Save
                            </Button>
                        </Form>
                        <PasswordModal showModal={changePassword} hideModal={() => setChangePassword(false)} />
                    </>
                )}
                <Toaster />
            </Container>
        </div>
    );
};

export default Profile;
