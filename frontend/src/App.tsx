import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Login from './components/Login';
import Registration from './components/Registration';
import Dashboard from './components/Dashboard';
import Logout from './components/Logout';
import MailActivation from './components/EmailActivation';
import RecoveryActivation from './components/RecoveryActivation';
import PasswordRecovery from './components/PasswordRecovery';

import Private from './router/Private';
import Profile from './components/Profile/Profile';
import ChangeEmailConfirm from './components/Profile/ChangeEmailConfirm';

const App: React.FC = () => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/dashboard" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/recovery" element={<PasswordRecovery />} />
                    <Route path="/mail/:link" element={<MailActivation />} />
                    <Route path="/confirm/:tempLink" element={<ChangeEmailConfirm />} />
                    <Route path="/recovery/:link" element={<RecoveryActivation />} />
                    <Route
                        path="/dashboard"
                        element={
                            <Private>
                                <Dashboard />
                            </Private>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <Private>
                                <Profile />
                            </Private>
                        }
                    />
                    <Route path="*" element={<div>There's nothing here: 404!</div>} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
