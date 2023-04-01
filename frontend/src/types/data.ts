export interface LoginResponseData {
    accessToken: string;
    refreshToken: string;
    username: string;
}

export interface GoogleDataSender {
    (clientId: string, credential: string): Promise<void>;
}

export interface FormValues {
    email: string;
    password: string;
}

export interface RegisterFormValues extends FormValues {
    name: string;
}
