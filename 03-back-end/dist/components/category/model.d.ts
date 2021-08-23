declare class CategoryModel {
    categoryId: number;
    name: string;
    imagePath: string;
    parentCategoryId: number | null;
    parentCategory: CategoryModel | null;
    subcategories: CategoryModel[];
}
export default CategoryModel;
