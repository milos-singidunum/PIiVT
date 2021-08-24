import CategoryService from './service';
import { Request, Response, NextFunction } from "express";
declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default CategoryController;
