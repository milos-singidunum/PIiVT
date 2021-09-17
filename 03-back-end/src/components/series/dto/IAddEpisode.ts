import Ajv from "ajv";
import { Episodes } from "../model";

interface IAddEpisodes {
    title: string,
    serbianTitle: string,
    year: string,
    directorName: string,
    description: string;
    imagePath: string;
    categoryId: number;
    episodes: Episodes[];
}


const ajv = new Ajv();

const IAddEpisodesValidator = ajv.compile({
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
        episodes: {
            type: "array",
            minItems: 0,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    episodeId: {
                        type: "number",
                        minimum: 1,
                    },
                    season: {
                        type: "string",
                        minLength:1,
                        maxLength:2,
                    },
                    episodeName: {
                        type: "string",
                        minLength:2,
                        maxLength:64,
                    },
                    episodeNum: {
                        type: "string",
                        minLength:1,
                        maxLength:3,
                    },
                    description: {
                        type: "string",
                        minLength:5,
                        maxLength:255,
                    },
                },
                required: [
                    "episodeId",
                    "season",
                    "episodeName",
                    "episodeNum",
                    "description",
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
       "episodes",
    ],
    additionalProperties: false,

});

export { IAddEpisodes };
export { IAddEpisodesValidator};
