import * as express from "express";
import * as cors from "cors";
import Config from "./config/dev";
import CategoryService from './components/category/service';
import CategoryController from './components/category/controller';

const application: express.Application = express();

application.use(cors()); // [handler -> instalirali smo ga nmp i cors]
application.use(express.json()); // za parsiranje json-a [handler]

//slanje nekog hardkodovanog objekta na putanju /about [handler]
application.get("/about", (req,res) => {
    res.send({
        "title": "About us", 
        "content": "<p> About us... </p>"
    }); 
});
//Staticko servisiranje
application.use(
    Config.server.static.route,express.static(Config.server.static.path, {
    index: Config.server.static.index, //samo pomocu putanje moze da se dodje do fajla
    cacheControl: Config.server.static.cacheControl, // ako ga vec imamo u kesu,ne skidamo ponovo
    maxAge: Config.server.static.maxAge, //maksimalno vreme cuvanja tog fajla
    etag: Config.server.static.etag,
    dotfiles: Config.server.static.dotfiles //ne mogu korisnici da pristupe skrivenim fajlovima 

}));

const categoryService: CategoryService = new CategoryService();
const categoryController: CategoryController = new CategoryController(categoryService);

application.get("/category" , categoryController.getAll.bind(categoryController));
application.get("/category/:id", categoryController.getById.bind(categoryController)) //:id => indikator za promenjive rute(varjabilno)


application.use((req,res) => {  // hendler use treba uvek da bude poslednji
    res.sendStatus(404);
})

application.listen(Config.server.port); // port na kom nam server radi