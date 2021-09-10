import * as express from "express";
import * as cors from "cors";
import Config from "./config/dev";
import CategoryRouter from './components/category/router';
import * as mysql2 from "mysql2/promise";
import IApplicationResources from "./common/IApplicationResources.interface";
import Router from "./router";
import FilmRouter from './components/film/router';
import GenreRouter from './components/genre/router';
import CategoryService from "./components/category/service";
import GenreService from "./components/genre/service";
import FilmService from "./components/film/service";
import * as fileUpload from "express-fileupload";
import AdministratorService from './components/administrator/service';
import AdministratorRouter from "./components/administrator/router";
import UserService from "./components/user/service";
import UserRouter from "./components/user/router";

async function main() {
    const application: express.Application = express();

    application.use(cors()); // [handler -> instalirali smo ga nmp i cors]
    application.use(express.json()); // za parsiranje json-a [handler]
    application.use(fileUpload({
        limits: {
            fileSize: Config.fileUpload.maxSize,
            files: Config.fileUpload.maxFiles,
        },
        useTempFiles: true,
        tempFileDir: Config.fileUpload.temporaryDirectory,
        uploadTimeout: Config.fileUpload.timeout,
        safeFileNames: true,  
        preserveExtension: true, // da osiguramo da se ekstenzije ne izbrisu
        createParentPath: true, 
        abortOnLimit: true, // ako file upload ne prodje ,controler nece ni uzmati u obiz fajl

    }));

    const resources: IApplicationResources = {
        databaseConnection: await mysql2.createConnection({
            host: Config.database.host,
            port: Config.database.port,
            user: Config.database.user,
            password: Config.database.password,
            database: Config.database.database,
            timezone: Config.database.timezone,
            supportBigNumbers: true,
        }),
    }

    resources.databaseConnection.connect();

    resources.services = {
        categoryService:      new CategoryService(resources),
        filmService:          new FilmService(resources),
        genreService:         new GenreService(resources),
        administratorService: new AdministratorService(resources),
        userService:          new UserService(resources),
       
    };


    //Staticko servisiranje
    application.use(
        Config.server.static.route,
        express.static(Config.server.static.path, {
            index: Config.server.static.index, //samo pomocu putanje moze da se dodje do fajla
            cacheControl: Config.server.static.cacheControl, // ako ga vec imamo u kesu,ne skidamo ponovo
            maxAge: Config.server.static.maxAge, //maksimalno vreme cuvanja tog fajla
            etag: Config.server.static.etag,
            dotfiles: Config.server.static.dotfiles //ne mogu korisnici da pristupe skrivenim fajlovima 

    }));

    Router.setupRoutes(application,resources,[
        new CategoryRouter(),
        new FilmRouter(),
        new GenreRouter(),
        new AdministratorRouter(),
        new UserRouter(),
    ]);
    
    application.use((req,res) => {  // hendler use treba uvek da bude poslednji
        res.sendStatus(404);
    });

    application.use((err , req, res, next) => {
        res.status(err.status).send(err.type);
    });

    application.listen(Config.server.port); // port na kom nam server radi
    
}

main();

