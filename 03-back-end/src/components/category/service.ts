import CategoryModel from "./model";
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import { errorMonitor } from "events";
import BaseService from "../../services/BaseService";

class CategoryModelAdapterOptions implements IModelAdapterOptions {
    loadParentCategory: boolean = false;
    loadSubcategories: boolean = false;
}
class CategoryService extends BaseService<CategoryModel> {

    protected async adaptModel(
        row: any,
        options: Partial<CategoryModelAdapterOptions> = {}
        ): Promise<CategoryModel>{
        const item: CategoryModel = new CategoryModel();
        // ?. -> pokusaj da pristupis tome , ako nepostoji vrati null
        item.categoryId = Number(row?.category_id); // moze i +(row?.category_id);
        item.name = row?.name;
        item.imagePath = row?.image_path;
        item.parentCategoryId = row?.parent__category_id;
        
        if (options.loadParentCategory && item.parentCategoryId !== null) {
            const data = await this.getById(item.parentCategoryId);

            if (data instanceof CategoryModel) {
                item.parentCategory = data;
            }
        }

        if (options.loadSubcategories) {
            const data = await this.getAllByParrentCategoryId(item.categoryId);
            if (Array.isArray(data)) {
                item.subcategories = data;
            }
        }

        return item;
    }

    public async getAll(): Promise<CategoryModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable<CategoryModelAdapterOptions>(
            'category' ,
            'parent__category_id',
            null,
             {
                 loadSubcategories:true,
             }
             );
    }

    public async getAllByParrentCategoryId(parentCatagoryId: number): Promise<CategoryModel[]|IErrorResponse> {
       return await this.getAllByFieldNameFromTable<CategoryModelAdapterOptions>(
           'category',
           'parent__category_id',
            parentCatagoryId,
            {
                loadSubcategories: true,
            }
        );    
    }

    public async getById(categoryId:number): Promise<CategoryModel|null|IErrorResponse>{
        return await this.getByIdFromTable<CategoryModelAdapterOptions>(
            "category" ,
            categoryId,
            {
             loadSubcategories: true,
            }
        );
    }

}
export default CategoryService;