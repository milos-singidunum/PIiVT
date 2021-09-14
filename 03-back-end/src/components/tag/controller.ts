import { Request, Response , NextFunction } from 'express';
import BaseController from '../../common/BaseController';
import { IAddTag, IAddTagValidator } from './dto/IAddTag';
import { IEditTag } from './dto/IEditTag';
import TagModel from './model';


class TagController extends BaseController {

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id;
        
        const tagId: number = +id;
 
        if (tagId <= 0) {
            res.sendStatus(400);
            return;
        }
 
        const result = await this.services.tagService.getById(tagId);
 
        if ( result === null) {
            res.sendStatus(404);
            return;
        }
 
        if (result instanceof TagModel) {
            res.send(result);
            return;
        }
 
        res.status(500).send(result);
     }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const tags = await this.services.tagService.getAll();
        res.send(tags);
    }

    public async add(req:Request , res:Response) {

        if(!IAddTagValidator(req.body)) {
            res.status(400).send(IAddTagValidator.errors);
            return;
        }

        res.send(await this.services.tagService.add(req.body as IAddTag));
    }

    public async edit(req: Request, res: Response) {
        const tagId = +(req.params.id);

        if (tagId <= 0) {
            res.sendStatus(400);
            return;
        }

        if (!IAddTagValidator(req.body)) {
            res.status(400).send(IAddTagValidator.errors);
            return;
        }

        const result = await this.services.genreService.getById(tagId);

        if (result === null) {
            res.sendStatus(404);
            return;
        }

        if (!(result instanceof TagModel)) {
            res.status(500).send(result);
            return;
        }

        res.send(await this.services.tagService.edit(tagId, req.body as IEditTag));
    }

}

export default TagController;