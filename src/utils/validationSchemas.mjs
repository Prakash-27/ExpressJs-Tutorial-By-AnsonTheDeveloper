export const createUserValidationSchema = {
    username: {
        notEmpty: {
            errorMessage: "username cannot be emmpty",
        },
        isString: {
            errorMessage: "username must be a string!",
        },
        isLength: {
            options: {
                min: 5,
                max: 32,
            },
            errorMessage: "username must be at least 5 characters with a max of 32 characters",
        },
    },
    displayName: {
        notEmpty: {
            errorMessage: "displayName cannot be emmpty",
        },
        isString: true,
    }
};