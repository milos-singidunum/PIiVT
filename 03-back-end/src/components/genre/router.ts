import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import GenreController from "./controller";

export default class GenreRouter implements IRouter {
    public setupRoutes(application: express.Application, resources:IApplicationResources){

        const genreController: GenreController = new GenreController(resources);

        application.get("/genre" ,
            AuthMiddleware.getVerifier("administrator", "user"),
            genreController.getAll.bind(genreController));

        application.get("/genre/:id",
            AuthMiddleware.getVerifier("administrator", "user"),
            genreController.getById.bind(genreController));

        application.post(
            "/genre" ,
            AuthMiddleware.getVerifier("administrator"), 
            genreController.add.bind(genreController));

        application.put(
            "/genre/:id",
            AuthMiddleware.getVerifier("administrator"), 
            genreController.edit.bind(genreController));
    }
}