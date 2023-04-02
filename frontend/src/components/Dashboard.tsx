import React from 'react';
import NavBar from './partials/NavBar';
import { Container } from 'react-bootstrap';

const Dashboard: React.FC = () => {
    return (
        <div>
            <NavBar />
            <Container>
                <h1>Dashboard</h1>
            </Container>
        </div>
    );
};

export default Dashboard;
