import Ajv from "ajv";

interface IAddGenre {
    name:string;
}

const ajv = new Ajv();

const IAddGenreValidator = ajv.compile({
    type: "object",
    properties: {
        
        name: {
            type: "string",
           
        },
    },
    required: [
       "name"
    ],
    additionalProperties: false,
});

export { IAddGenre };
export { IAddGenreValidator};