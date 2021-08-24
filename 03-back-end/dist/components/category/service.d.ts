import CategoryModel from "./model";
declare class CategoryService {
    getAll(): Promise<CategoryModel[]>;
    getById(categoryId: number): Promise<CategoryModel | null>;
}
export default CategoryService;
