import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import TagController from "./controller";

export default class TagRouter implements IRouter {
    public setupRoutes(application: express.Application, resources:IApplicationResources){

        const tagController: TagController = new TagController(resources);

        application.get("/tag" ,
            AuthMiddleware.getVerifier("administrator", "user"),
            tagController.getAll.bind(tagController));

        application.get(
            "/tag/:id" ,
             AuthMiddleware.getVerifier("administrator", "user"),
             tagController.getById.bind(tagController));
       
        application.post(
            "/tag" ,
            AuthMiddleware.getVerifier("administrator"),
            tagController.add.bind(tagController));

        application.put(
            "/tag/:id",
            AuthMiddleware.getVerifier("administrator"),
            tagController.edit.bind(tagController));
    }
}