import CategoryModel from "./model";
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import { errorMonitor } from "events";
import BaseService from "../../services/BaseService";
import { IAddCategory } from './dto/IAddCategory';
import { IEditCategory } from "./dto/IEditCategory";

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
            const data = await this.getAllByParrentCategoryId(
                item.categoryId,
                {
                    loadSubcategories: options.loadSubcategories
                });
                
            if (Array.isArray(data)) {
                item.subcategories = data;
            }
        }

        return item;
    }

    public async getAll(
        options: Partial<CategoryModelAdapterOptions> = {},
    ): Promise<CategoryModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable<CategoryModelAdapterOptions>(
            'category' ,
            'parent__category_id',
            null,
            options,
             );
    }

    public async getAllByParrentCategoryId(
        parentCatagoryId: number,
        options: Partial<CategoryModelAdapterOptions> = {},
        ): Promise<CategoryModel[]|IErrorResponse> {
       return await this.getAllByFieldNameFromTable<CategoryModelAdapterOptions>(
           'category',
           'parent__category_id',
            parentCatagoryId,
            options,
        );    
    }

    public async getById(
        categoryId:number,
        options: Partial<CategoryModelAdapterOptions> = { },
        ): Promise<CategoryModel|null|IErrorResponse>{
        return await this.getByIdFromTable<CategoryModelAdapterOptions>(
            "category" ,
            categoryId,
            options
        );
    }

    public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse> {
        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `
                INSERT
                    category
                SET
                    name = ?,
                    image_path = ?,
                    parent__category_id = ?;`;

            this.db.execute(sql, [ data.name, data.imagePath, data.parentCategoryId ?? null ])
                .then(async result => {

                    const insertInfo: any = result[0];

                    const newCategoryId: number = +(insertInfo?.insertId);
                    resolve(await this.getById(newCategoryId));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async edit(
        categoryId: number,
        data: IEditCategory,
        options: Partial<CategoryModelAdapterOptions> = { },
    ): Promise<CategoryModel|IErrorResponse|null> {
        const result = await this.getById(categoryId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof CategoryModel)) {
            return result;
        }

        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `
                UPDATE
                    category
                SET
                    name = ?,
                    image_path = ?
                WHERE
                    category_id = ?;`;

            this.db.execute(sql, [ data.name, data.imagePath, categoryId ])
                .then(async result => {
                    resolve(await this.getById(categoryId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async delete(categoryId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM category WHERE category_id = ?;";
            this.db.execute(sql, [categoryId])
                .then(async result => {
                    const deleteInfo: any = result[0];
                    const deletedRowCount: number = +(deleteInfo?.affectedRows);

                    if (deletedRowCount === 1) {
                        resolve({
                            errorCode: 0,
                            errorMessage: "One record deleted."
                        });
                    } else {
                        resolve({
                            errorCode: -1,
                            errorMessage: "This record could not be deleted because it does not exist."
                        });
                    }
                })
                .catch(error => {
                    if (error?.errno === 1451) {
                        resolve({
                            errorCode: -2,
                            errorMessage: "This record could not be deleted beucase it has subcategories."
                        });
                        return;
                    }

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }

}
export default CategoryService;