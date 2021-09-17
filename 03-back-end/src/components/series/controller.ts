import { Request, Response , NextFunction } from 'express';
import BaseController from '../../common/BaseController';
import Config from '../../config/dev';
import { IAddEpisodes, IAddEpisodesValidator } from './dto/IAddEpisode';
import { IAddSeries, IAddSeriesValidator } from './dto/IAddSeries';
import { IEditSeries, IEditSeriesValidator } from './dto/IEditSeries';

class SeriesController extends BaseController{

    public async getById(req: Request, res: Response, next: NextFunction) {
       const id: number = +(req.params?.id);
       
       if (id <= 0) {
        res.sendStatus(400);
        return;
    }

    const item = await this.services.seriesService.getById(
        id,
        {
            loadCategory: true,
            loadGenres: true,
            loadEpisodes: true,
        }
    );

       if ( item === null) {
           res.sendStatus(404);
           return;
       }

       if (item === null) {
        res.sendStatus(404);
        return;
        }

        res.send(item);
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const shows = await this.services.seriesService.getAll();
        res.send(shows);
    }

    public async getAllSeriesFromOneCategory(req: Request, res: Response, next: NextFunction) {
        const categoryId: number = +(req.params.cid);
        res.send(await this.services.seriesService.getAllByCategoryId(categoryId));
    }

   

    public async add(req: Request , res: Response) {
        try {

            const data = JSON.parse(req.body?.data);

            if (!IAddSeriesValidator(data)) {
                res.status(400).send(IAddSeriesValidator.errors);
                return;
            }

            const result = await this.services.seriesService.add(data as IAddSeries);

            res.send(result);

         } catch (e) {
            
            res.status(400).send(e?.message);
        }

    }

    public async addSeriesWithEpisodes(req: Request , res: Response) {
        try {

            const data = JSON.parse(req.body?.data);

            if (!IAddEpisodesValidator(data)) {
                res.status(400).send(IAddEpisodesValidator.errors);
                return;
            }

            const result = await this.services.seriesService.addSeriesWithEpisodes(data as IAddEpisodes);

            res.send(result);

         } catch (e) {
            
            res.status(400).send(e?.message);
        }

    }

    public async edit(req: Request , res:Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        if(!IEditSeriesValidator(req.body)) {
            return res.status(400).send(IEditSeriesValidator.errors);
        }

        const result = await this.services.filmService.edit(id, req.body as IEditSeries);

        if (result === null) {
            return res.sendStatus(404);
        }

        res.send(result);
    }

    public async delete(req: Request, res: Response) {
        const id: number = +(req.params?.id);

        if (id <= 0) {
            return res.sendStatus(400);
        }

        const item = await this.services.seriesService.getById(id);

        if (item === null) {
            res.sendStatus(404);
            return;
        }

        res.send(await this.services.seriesService.delete(id));
    }

}

export default SeriesController;

