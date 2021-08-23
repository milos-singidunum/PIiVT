import CategoryModel from "./model";
declare class CategoryService {
    getAll(): Promise<CategoryModel[]>;
}
export default CategoryService;
