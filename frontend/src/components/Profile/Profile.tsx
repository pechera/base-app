import React, { useState } from 'react';
import NavBar from '../partials/NavBar';
import { Container, Form, Button } from 'react-bootstrap';
import { axiosInstance } from '../../services/Axios';
import { useQuery } from 'react-query';

import styles from './styles/profile.module.css';

import { IProfile } from '../../types/data';

import PasswordModal from './PasswordModal';

const getProfileData = async () => {
    const { data } = await axiosInstance.get<IProfile>('/api/profile');
    return data;
};

const Profile: React.FC = () => {
    const [email, setEmail] = useState<string>('');

    const [changeEmail, setChangeEmail] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(false);

    const { isLoading, error, data } = useQuery('profile', getProfileData);

    return (
        <div>
            <NavBar />
            <Container className="p-3">
                <h1>Profile</h1>
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
                                        <span className={styles.activated}>
                                            activated
                                        </span>
                                    ) : (
                                        <span className={styles.activated}>
                                            not activated
                                        </span>
                                    )}
                                </div>
                            )}
                            <div
                                onClick={() => setChangeEmail((prev) => !prev)}
                                className={styles.change_label}
                            >
                                Change email
                            </div>
                        </Form.Group>
                        <PasswordModal
                            showModal={changePassword}
                            hideModal={() => setChangePassword(false)}
                        />
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
            </Container>
        </div>
    );
};

export default Profile;
