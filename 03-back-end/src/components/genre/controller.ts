import GenreService from './service';
import { Request, Response , NextFunction } from 'express';
import { IAddGenre, IAddGenreValidator } from './dto/AddGenre';
import GenreModel from './model';
import { IEditGenre, IEditGenreValidator } from './dto/EditGenre';


class GenreController {
    private genreService: GenreService;

    constructor(genreService:GenreService) {
        this.genreService = genreService;
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;
        
        const genreId: number = +id;
 
        if (genreId <= 0) {
            res.sendStatus(400);
            return;
        }
 
        const result = await this.genreService.getById(genreId, {
            loadCategory: true,
        });
 
        if ( result === null) {
            res.sendStatus(404);
            return;
        }
 
        if (result instanceof GenreModel) {
            res.send(result);
            return;
        }
 
        res.status(500).send(result);
     }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const genres = await this.genreService.getAll();
        res.send(genres);
    }

    public async add(req:Request , res:Response) {

        if(!IAddGenreValidator(req.body)) {
            res.status(400).send(IAddGenreValidator.errors);
            return;
        }

        res.send(await this.genreService.add(req.body as IAddGenre));
    }

    public async edit(req: Request, res: Response) {
        const genreId = +(req.params.id);

        if (genreId <= 0) {
            res.sendStatus(400);
            return;
        }

        if (!IEditGenreValidator(req.body)) {
            res.status(400).send(IEditGenreValidator.errors);
            return;
        }

        const result = await this.genreService.getById(genreId);

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        if (!(result instanceof GenreModel)) {
            res.status(500).send(result);
            return;
        }

        res.send(await this.genreService.edit(genreId, req.body as IEditGenre));
    }

}

export default GenreController;