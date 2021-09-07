import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import FilmService from './service';
import FilmController from "./controller";

export default class FilmRouter implements IRouter {
    public setupRoutes(application: express.Application, resources:IApplicationResources){
        //controler
        const filmController: FilmController = new FilmController(resources);

        application.get("/film" ,              filmController.getAll.bind(filmController));
        application.get("/film/:id" ,          filmController.getById.bind(filmController));
        application.get("/category/:cid/film", filmController.getAllFilmFromOneCategory.bind(filmController)) //:id => indikator za promenjive rute(varjabilno)
        application.post("/film" ,             filmController.add.bind(filmController));
        //application.put("/film/:id",           filmController.edit.bind(filmController));
    }
}