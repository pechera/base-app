// Login
export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
    username: string;
}

export interface FormValues {
    email: string;
    password: string;
}

export interface LoginDataSender {
    ({ email, password }: FormValues): Promise<void>;
}

export interface GoogleDataSender {
    (clientId: string, credential: string): Promise<void>;
}

// Regostration

export interface RegisterFormValues extends FormValues {
    name: string;
}

export interface RegisterDataSender {
    ({ email, password, name }: RegisterFormValues): Promise<void>;
}

// Password Reset

export interface RecoveryFormValues {
    email: string;
}

export interface RecoveryDataSender {
    (data: RecoveryFormValues): Promise<void>;
}

export interface RecoveryActiationFormValues {
    password: string;
    confirmPassword: string;
}

export interface RecoveryActivationDataSender {
    (data: { password: string }): Promise<void>;
}
