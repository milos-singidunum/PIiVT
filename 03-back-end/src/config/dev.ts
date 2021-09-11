import IConfig from "./IConfig.interface";
import * as dotenv from "dotenv";

const dotEnvResult = dotenv.config();
if (dotEnvResult.error) throw "Environment configuration file error: " + dotEnvResult.error;



const Config: IConfig = {
    server: {
        port: 40080,
        static: {
            route: "/static",
            path: "./static/",
            cacheControl: false,
            dotfiles: "deny",
            etag: false,
            index: false,
            maxAge: 360000,
        }
    },
    database: {
        host: "localhost",
        port: 3305,
        user: "root",
        password: "root41a",
        database: "movie_app_database",
        charset: "utf8",
        timezone: "+01:00",
    },
    fileUpload: {
        maxSize:  10 * 1024 * 1024,
        maxFiles: 5,
        temporaryDirectory: '../../../temp',
        uploadDestinationDirectory: 'static/uploads/',
        timeout: 60000,
        photos: {
            limits: {
                minWidth: 320,
                maxWidth: 1920,
                minHeight: 200,
                maxHeight: 1440,
            },
            resizes: [
                {
                    sufix: "-small",
                    fit: "cover",
                    width: 400,
                    height: 300,
                },
                {
                    sufix: "-medium",
                    fit: "cover",
                    width: 800,
                    height: 600,
                },
            ],
        },
    },
    mail: {
        hostname: process.env?.MAIL_HOST,
        port: +(process.env?.MAIL_PORT),
        secure: process.env?.MAIL_SECURE === "true",
        username: process.env?.MAIL_USERNAME,
        password: process.env?.MAIL_PASSWORD,
        fromEmail: process.env?.MAIL_FROM,
        debug: true,
    },

};

export default Config;