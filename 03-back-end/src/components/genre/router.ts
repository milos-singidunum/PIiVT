import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import GenreController from "./controller";

export default class GenreRouter implements IRouter {
    public setupRoutes(application: express.Application, resources:IApplicationResources){

        const genreController: GenreController = new GenreController(resources);

        application.get("/genre" , genreController.getAll.bind(genreController));
        application.get("/genre/:id" , genreController.getById.bind(genreController));
        application.post("/genre" ,genreController.add.bind(genreController));
        application.put("/genre/:id",genreController.edit.bind(genreController));
    }
}