import Ajv from "ajv";

interface IEditUser {
    username: string;
    email: string;
    password: string;
    forename: string;
    surname: string;
    isActive: boolean;
}

const ajv = new Ajv();

const IEditUserValidator = ajv.compile({
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
        isActive: {
            type: "boolean",
        }
    },
    required: [
        "username",
        "email",
        "password",
        "forename",
        "surname",
        "isActive",
    ],
    additionalProperties: false,
});

export { IEditUser };
export { IEditUserValidator };
