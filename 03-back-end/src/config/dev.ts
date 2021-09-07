import IConfig from "./IConfig.interface";

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
    }
};

export default Config;