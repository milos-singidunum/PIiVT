import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import SeriesController from './controller';

export default class SeriesRouter implements IRouter {
    public setupRoutes(application: express.Application, resources:IApplicationResources){
        //controler
        const seriesController: SeriesController = new SeriesController(resources);

        application.get("/show" ,seriesController.getAll.bind(seriesController));

        application.get(
            "/show/:id" ,
            AuthMiddleware.getVerifier("administrator", "user"),
            seriesController.getById.bind(seriesController));

        application.get(
            "/category/:cid/show",
            AuthMiddleware.getVerifier("administrator", "user"),
            seriesController.getAllSeriesFromOneCategory.bind(seriesController)) //:id => indikator za promenjive rute(varjabilno)
        
        application.post(
            "/show" ,
            AuthMiddleware.getVerifier("administrator"),
            seriesController.add.bind(seriesController));

        application.post(
            "/show/episodes" ,
            //AuthMiddleware.getVerifier("administrator"),
            seriesController.addSeriesWithEpisodes.bind(seriesController));

        application.put(
            "/show/:id" ,
            AuthMiddleware.getVerifier("administrator"),          
            seriesController.edit.bind(seriesController));

        application.delete("/show/:id",
            AuthMiddleware.getVerifier("administrator"),
            seriesController.delete.bind(seriesController));

    }
}