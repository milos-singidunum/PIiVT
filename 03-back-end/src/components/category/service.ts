import CategoryModel from "./model";

class CategoryService {
    public async getAll(): Promise<CategoryModel[]> {
       const lista: CategoryModel[] = [];

       //Moking

       lista.push({
        categoryId: 1,
        name: "Category A",
        imagePath: "static/categories/1.png",
        parentCategoryId: null,
        parentCategory: null,
        subcategories: [],})

       return lista;

    }
}
export default CategoryService;