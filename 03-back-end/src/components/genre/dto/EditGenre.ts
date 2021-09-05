import Ajv from "ajv";

interface IEditGenre {
    name:string;
}

const ajv = new Ajv();

const IEditGenreValidator = ajv.compile({
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

export { IEditGenre };
export { IEditGenreValidator};