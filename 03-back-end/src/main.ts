import * as express from "express";
import * as cors from "cors";
import Config from "./config/dev";
import CategoryRouter from './components/category/router';
import * as mysql2 from "mysql2/promise";
import IApplicationResources from "./common/IApplicationResources.interface";
import Router from "./router";

async function main() {
    const application: express.Application = express();

    application.use(cors()); // [handler -> instalirali smo ga nmp i cors]
    application.use(express.json()); // za parsiranje json-a [handler]

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
    ]);
    
    application.use((req,res) => {  // hendler use treba uvek da bude poslednji
        res.sendStatus(404);
    });

    application.listen(Config.server.port); // port na kom nam server radi
    
}

main();

