import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import TagController from "./controller";

export default class TagRouter implements IRouter {
    public setupRoutes(application: express.Application, resources:IApplicationResources){

        const tagController: TagController = new TagController(resources);

        application.get("/tag" , tagController.getAll.bind(tagController));
        application.get("/tag/:id" , tagController.getById.bind(tagController));
        application.post("/tag" ,tagController.add.bind(tagController));
        application.put("/tag/:id",tagController.edit.bind(tagController));
    }
}