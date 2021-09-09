import Ajv from "ajv";
import { FilmGenres } from "../model";

interface IEditFilm {
    title: string,
    serbianTitle: string,
    year: string,
    directorName: string,
    description: string;
    categoryId: number;
    genres: FilmGenres[];
}



const ajv = new Ajv();

const IEditFilmValidator = ajv.compile({
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
            maxLength:255,
        },
        categoryId: {
            type: "integer",
            minimum:1,
        },
        genres: {
            type: "array",
            minItems: 0,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    genreId: {
                        type: "number",
                        minimum: 1,
                    }
                },
                required: [
                    "genreId",
                ],
                additionalProperties: false,
            },
        },
    },
    required: [
       "title",
       "serbianTitle",
       "year",
       "directorName",
       "description",
       "categoryId",
       "genres",
    ],
    additionalProperties: false,

});

export { IEditFilm };
export { IEditFilmValidator};