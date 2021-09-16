import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import ReviewController from "./controller";

export default class ReviewRouter implements IRouter {
    public setupRoutes(application: express.Application, resources:IApplicationResources){

        const reviewController: ReviewController = new ReviewController(resources);

        application.get("/review" ,
            AuthMiddleware.getVerifier( "user"),
            reviewController.getAll.bind(reviewController));

        application.get("/genre/:id",
            AuthMiddleware.getVerifier("administrator", "user"),
            reviewController.getById.bind(reviewController));
    }
}