import CategoryService from './service';
import {Request, Response, NextFunction} from "express";
import CategoryModel from './model';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import BaseController from '../../common/BaseController';
import ReviewModel from './model';

class ReviewController extends BaseController {
    
    async getAll(req: Request, res: Response, next: NextFunction) {
        const reviews = await this.services.reviewService.getAll();
        res.send(reviews);
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const id: string = req.params.id 

        const filmReviewId: number = +id;

        if (filmReviewId <= 0) {
            res.sendStatus(400);
            return;
        }
        const data: ReviewModel|null|IErrorResponse = await this.services.reviewService.getById(+id);

        if (data === null) {
            res.sendStatus(404);
            return;
        }

        if (data instanceof ReviewModel) {
            res.send(data);
            return; 
        }

        res.status(500).send(data);   
    }
}

export default ReviewController;
