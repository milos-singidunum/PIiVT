import Ajv from "ajv";

interface IAddFilm {
    title: string,
    serbianTitle: string,
    year: string,
    directorName: string,
    description: string;
    picturePath: string;
    categoryId: number;
}

const ajv = new Ajv();

const IAddFilmValidator = ajv.compile({
    type: "object",
    properties: {
        
        title: {
            type: "string",
            minLength: 2,
            maxLength:64,
        }, 
        serbianTitle: {
            type: "string",
            minLength: 2,
            maxLength:64,
        },
        year: {
            type: "string",
            minLength: 4,
            maxLength:4,
        },
        directorName: {
            type: "string",
            minLength: 4,
            maxLength:32,
        },
        description: {
            type: "string",
            minLength: 32,
            maxLength:255,
        },
        picturePath: {
            type: "string",
            minLength: 255,
            pattern: "\.(png|jpg)$",
        },
        categoryId: {
            type: "integer",
            minimum:1,
        },
    },
    required: [
       "title",
       "serbianTitle",
       "year",
       "directorName",
       "description",
       "picturePath",
       "categoryId",
    ],
    additionalProperties: false,

});

export { IAddFilm };
export { IAddFilmValidator};