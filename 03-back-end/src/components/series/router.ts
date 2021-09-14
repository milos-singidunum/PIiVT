import * as express from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import SeriesController from './controller';

export default class SeriesRouter implements IRouter {
    public setupRoutes(application: express.Application, resources:IApplicationResources){
        //controler
        const seriesController: SeriesController = new SeriesController(resources);

        application.get("/show" ,              seriesController.getAll.bind(seriesController));
        application.get("/show/:id" ,          seriesController.getById.bind(seriesController));
        application.get("/category/:cid/show", seriesController.getAllSeriesFromOneCategory.bind(seriesController)) //:id => indikator za promenjive rute(varjabilno)
        application.post("/show" ,             seriesController.add.bind(seriesController));
        application.put("/show/:id" ,          seriesController.edit.bind(seriesController));
        application.delete("/show/:id",        seriesController.delete.bind(seriesController));

    }
}