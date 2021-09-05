import { Request, Response , NextFunction } from 'express';
import FilmService from './service';
import FilmModel from './model';
import { IAddFilm, IAddFilmValidator } from './dto/AddFilm';
import { IEditFilm, IEditFilmValidator } from './dto/EditFilm';

class FilmController {
    private filmService: FilmService;

    constructor(filmService:FilmService) {
        this.filmService = filmService;
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
       const id: string = req.params.id;
       
       const filmId: number = +id;

       if (filmId <= 0) {
           res.sendStatus(400);
           return;
       }

       const result = await this.filmService.getById(filmId, {
           loadCategory: true,
       });

       if ( result === null) {
           res.sendStatus(404);
           return;
       }

       if (result instanceof FilmModel) {
           res.send(result);
           return;
       }

       res.status(500).send(result);
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const films = await this.filmService.getAll();
        res.send(films);
    }

    public async getAllFilmFromOneCategory(req: Request, res: Response, next: NextFunction) {
        const categoryId: number = +(req.params.cid);
        res.send(await this.filmService.getAllByCategoryId(categoryId));
    }

    public async add(req:Request , res:Response) {
        
        if(!IAddFilmValidator(req.body)) {
            res.status(400).send(IAddFilmValidator.errors);
            return;
        }

        res.send(await this.filmService.add(req.body as IAddFilm));
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

        const result = await this.filmService.getById(filmId);

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        if (!(result instanceof FilmModel)) {
            res.status(500).send(result);
            return;
        }

        res.send(await this.filmService.edit(filmId, req.body as IEditFilm));
    }
}

export default FilmController;

