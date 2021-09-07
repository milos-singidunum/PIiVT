import { Request, Response , NextFunction } from 'express';
import { IAddFilm, IAddFilmValidator, UploadFilmPhoto } from './dto/AddFilm';
import BaseController from '../../common/BaseController';
import * as fileUpload from 'express-fileupload';
import Config from '../../config/dev';
import {v4} from "uuid";

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
            loadPhotos: true,
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
    /*
    public async add(req:Request , res:Response) {
        
        if(!IAddFilmValidator(req.body)) {
            res.status(400).send(IAddFilmValidator.errors);
            return;
        }

        res.send(await this.services.filmService.add(req.body as IAddFilm));
    }
    */

    public async add(req: Request , res: Response) {
        
        if(!req.files || Object.keys(req.files).length === 0) {
            res.status(400).send("You must upload at lease one and a maxumum of" + Config.fileUpload.maxFiles + "photos.");
            return;
        }

        const fileKeys: string[] = Object.keys(req.files);

        const uploadFilmPhotos: UploadFilmPhoto[] = [];

        for(const fileKey of fileKeys) {
            const file = req.files[fileKey] as any;
            
            const randomString = v4();
            const originalName = file?.name;
            const now = new Date();
            const imagePath = Config.fileUpload.uploadDestinationDirectory + 
                              (Config.fileUpload.uploadDestinationDirectory.endsWith("/") ? "" : "/") +
                              now.getFullYear() + "/" +
                              ((now.getMonth() + 1) + "").padStart(2,"0") + "/" + 
                              randomString + "-" + originalName;

           await file.mv(imagePath);

           uploadFilmPhotos.push({
               imagePath: imagePath,
           });
        }

        try {
            const data = JSON.parse(req.body?.data);

            if (!IAddFilmValidator(data)) {
                res.status(400).send(IAddFilmValidator.errors);
                return;
            }

            const result = await this.services.filmService.add(data as IAddFilm, uploadFilmPhotos);

            res.send(result);

         } catch (e) {
            
            res.status(400).send(e?.message);
        }

        
    }
    /*
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
    } */
}

export default FilmController;

