export interface IUser {
    id: string;
    name: string;
    register_date: Date;
    password: string;
    email: string;
    activated: boolean;
    activation_link: string;
    register_method: string;
}
