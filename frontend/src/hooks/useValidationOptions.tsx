import { RegisterOptions } from 'react-hook-form';

interface ValidationOptions {
    validationNameOptions: RegisterOptions;
    validationEmailOptions: RegisterOptions;
    validationPasswordOptions: RegisterOptions;
}

interface IValidationOptionsHook {
    (): ValidationOptions;
}

const useValidationOptions: IValidationOptionsHook = () => {
    const validationNameOptions: RegisterOptions = {
        required: 'Name is requared',
        minLength: {
            value: 3,
            message: 'Minimum 3 symbols',
        },
        maxLength: {
            value: 50,
            message: 'Maximum 50 symbols',
        },
    };

    const validationEmailOptions: RegisterOptions = {
        required: 'Email is requared',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
        },
    };

    const validationPasswordOptions: RegisterOptions = {
        required: 'Password is requared',
        minLength: {
            value: 5,
            message: 'Minimum 5 symbols',
        },
        maxLength: {
            value: 50,
            message: 'Maximum 50 symbols',
        },
    };

    return { validationNameOptions, validationEmailOptions, validationPasswordOptions };
};

export default useValidationOptions;
