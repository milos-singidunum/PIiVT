import Ajv from "ajv";

interface IEditTag {
    name:string;
}

const ajv = new Ajv();

const IEditTagValidator = ajv.compile({
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

export { IEditTag };
export { IEditTagValidator};