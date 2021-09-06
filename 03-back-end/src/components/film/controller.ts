import { Request, Response , NextFunction } from 'express';
import FilmService from './service';
import FilmModel from './model';
import { IAddFilm, IAddFilmValidator } from './dto/AddFilm';
import { IEditFilm, IEditFilmValidator } from './dto/EditFilm';
import BaseController from '../../common/BaseController';

class FilmController extends BaseController{

    public async getById(req: Request, res: Response, next: NextFunction) {
       const id: number = +(req.params?.id);
       
       if (id <= 0) {
        res.sendStatus(400);
        return;
    }

    const item = await this.services.filmService.getById(
        id,
        {
            loadCategory: true,
            loadGenres: true,
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
        /*
       if (result instanceof FilmModel) {
           res.send(result);
           return;
       }

       res.status(500).send(result); */
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const films = await this.services.filmService.getAll();
        res.send(films);
    }

    public async getAllFilmFromOneCategory(req: Request, res: Response, next: NextFunction) {
        const categoryId: number = +(req.params.cid);
        res.send(await this.services.filmService.getAllByCategoryId(categoryId));
    }

    public async add(req:Request , res:Response) {
        
        if(!IAddFilmValidator(req.body)) {
            res.status(400).send(IAddFilmValidator.errors);
            return;
        }

        res.send(await this.services.filmService.add(req.body as IAddFilm));
    }

    public async edit(req: Request, res: Response) {
        const filmId = +(req.params.id);

        if (filmId <= 0) {
            res.sendStatus(400);
            return;
        }

        if (!IEditFilmValidator(req.body)) {
            res.status(400).send(IEditFilmValidator.errors);
            return;
        }

        const result = await this.services.filmService.getById(filmId);

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        if (!(result instanceof FilmModel)) {
            res.status(500).send(result);
            return;
        }

        res.send(await this.services.filmService.edit(filmId, req.body as IEditFilm));
    }
}

export default FilmController;

