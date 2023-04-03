// Main
export interface IOneMessageResponse {
    message: string;
}

// Login

export interface ILoginResponseData {
    accessToken: string;
    refreshToken: string;
    username: string;
}

export interface ILoginFormValues {
    email: string;
    password: string;
}

export interface IGoogleFormValues {
    clientId: string;
    credential: string;
}

// Registration

export interface IRegisterFormValues extends ILoginFormValues {
    name: string;
}

export interface IActivationLink {
    link: string;
}

// Password Reset

export interface RecoveryFormValues {
    email: string;
}

export interface IRecoveryActivationSendData {
    link: string;
    password: string;
}

export interface IRecoveryActiationFormValues {
    password: string;
    confirmPassword: string;
}

// Profile

export interface IProfile {
    name: string;
    email: string;
    activated: boolean;
    register_method?: string;
}

// Change Password

export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export interface IPasswordsToSend {
    currentPassword: string;
    newPassword: string;
}

export interface IChangeModalProps {
    hideModal: () => void;
    showModal: boolean;
}
