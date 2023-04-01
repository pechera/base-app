import React from 'react';
import NavBar from './partials/NavBar';
import { Container } from 'react-bootstrap';

const Profile: React.FC = () => {
    return (
        <div>
            <NavBar />
            <Container>Profile</Container>
        </div>
    );
};

export default Profile;
