import React, { useState } from 'react';
import NavBar from '../partials/NavBar';
import { Container, Form } from 'react-bootstrap';
import { axiosInstance } from '../../services/Axios';
import { useQuery } from 'react-query';
import toast, { Toaster } from 'react-hot-toast';

import styles from './styles/profile.module.css';

import { IProfile } from '../../types/data';

import PasswordModal from './PasswordModal';
import EmailModal from './EmailModal';

const getProfileData = async () => {
    const { data } = await axiosInstance.get<IProfile>('/api/profile');

    return data;
};

const Profile: React.FC = () => {
    const [changeEmail, setChangeEmail] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(false);

    const { isLoading, error, data } = useQuery('profile', getProfileData);

    if (error) toast.error('Something went wrong');

    const changeEmailHandler = () => {
        if (data && data.activated === false) {
            toast.error('I order to change email you need to activate it first', {
                id: 'emailLoad',
            });
        } else {
            setChangeEmail(true);
        }
    };

    return (
        <div>
            <NavBar />
            <Container className="p-3">
                <h1>Profile</h1>
                {data && (
                    <Form className="p-2 mt-3">
                        <Form.Group className="mt-3" controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <div>{data.name}</div>
                        </Form.Group>
                        <Form.Group className="mt-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <div>
                                <span>{data.email}</span>
                                {data.activated ? <span className={styles.activated}>activated</span> : <span className={styles.activated}>not activated</span>}
                            </div>
                            {data.register_method === undefined && (
                                <div onClick={changeEmailHandler} className={styles.change_password}>
                                    Change email {'>'}
                                </div>
                            )}
                        </Form.Group>
                        {data.register_method === undefined ? (
                            <div className={styles.change_password} onClick={() => setChangePassword(true)}>
                                Change password {'>'}
                            </div>
                        ) : (
                            <div className="mt-3">You registered with Google</div>
                        )}
                    </Form>
                )}

                <EmailModal showModal={changeEmail} hideModal={() => setChangeEmail(false)} />
                <PasswordModal showModal={changePassword} hideModal={() => setChangePassword(false)} />
                <Toaster />
            </Container>
        </div>
    );
};

export default Profile;
