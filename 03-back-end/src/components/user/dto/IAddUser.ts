import Ajv from "ajv";

interface IAddUser {
    username: string;
    email: string;
    password: string;
    forename: string;
    surname: string;
}

const ajv = new Ajv();

const IAddUserValidator = ajv.compile({
    type: "object",
    properties: {
        username: {
            type: "string",
            minLength: 4,
            maxLength: 64,
        },
        email: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
        password: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
        forename: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        surname: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
    },
    required: [
        "username",
        "email",
        "password",
        "forename",
        "surname",
    ],
    additionalProperties: false,
});

export { IAddUser };
export { IAddUserValidator };
