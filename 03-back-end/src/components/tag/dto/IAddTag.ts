import Ajv from "ajv";

interface IAddTag {
    name:string;
}

const ajv = new Ajv();

const IAddTagValidator = ajv.compile({
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

export { IAddTag };
export { IAddTagValidator};