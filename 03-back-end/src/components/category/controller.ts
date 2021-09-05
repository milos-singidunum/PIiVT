import CategoryService from './service';
import {Request, Response, NextFunction} from "express";
import CategoryModel from './model';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import BaseController from '../../common/BaseController';

class CategoryController extends BaseController {
    
    // hendler za getAll
    async getAll(req: Request, res: Response, next: NextFunction) {
        const categories = await this.services.categoryService.getAll();
        res.send(categories);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id //sve sto stize sa interneta je string

        const categoryId: number = +id;

        if (categoryId <= 0) {
            res.sendStatus(400);
            return;
        }
        const data: CategoryModel|null|IErrorResponse = await this.services.categoryService.getById(+id);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof CategoryModel) {
            res.send(data);
            return; 
        }

        res.status(500).send(data);

        
    }
}

export default CategoryController;