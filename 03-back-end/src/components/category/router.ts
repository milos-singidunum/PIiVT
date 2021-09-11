import * as express from "express";
import CategoryService from './service';
import CategoryController from './controller';
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";

export default class CategoryRouter implements IRouter {
    public setupRoutes(application: express.Application,resources:IApplicationResources){

        const categoryController: CategoryController = new CategoryController(resources);

        application.get(
            "/category",
            AuthMiddleware.getVerifier("administrator", "user"),
            categoryController.getAll.bind(categoryController)
        );
        //application.get("/category" , categoryController.getAll.bind(categoryController));
        application.get("/category/:id", categoryController.getById.bind(categoryController)) //:id => indikator za promenjive rute(varjabilno)
    }
}