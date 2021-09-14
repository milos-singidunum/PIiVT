import Ajv from "ajv";
import { SeriesGenre } from "../model";

interface IAddSeries {
    title: string,
    serbianTitle: string,
    year: string,
    directorName: string,
    description: string;
    imagePath: string;
    categoryId: number;
    genres: SeriesGenre[];
}


const ajv = new Ajv();

const IAddSeriesValidator = ajv.compile({
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
            maxLength:64 * 1024,
        },
        imagePath: {
            type: "string",
            maxLength: 255,
            pattern: "\.(png|jpg)$",
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
       "imagePath",
       "categoryId",
       "genres",
    ],
    additionalProperties: false,

});

export { IAddSeries };
export { IAddSeriesValidator};
