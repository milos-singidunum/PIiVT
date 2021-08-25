import CategoryModel from "./model";
import * as mysql2 from 'mysql2/promise';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import { errorMonitor } from "events";

class CategoryService {
    private db: mysql2.Connection;

    constructor(db: mysql2.Connection) {
        this.db = db;
    }

    protected async adaptModel(
        row: any,
        options: Partial<IModelAdapterOptions> = {loadParent: false, loadChildren: false}
        ): Promise<CategoryModel>{
        const item: CategoryModel = new CategoryModel();
        // ?. -> pokusaj da pristupis tome , ako nepostoji vrati null
        item.categoryId = Number(row?.category_id); // moze i +(row?.category_id);
        item.name = row?.name;
        item.imagePath = row?.image_path;
        item.parentCategoryId = row?.parent__category_id;
        
        if (options.loadParent && item.parentCategoryId !== null) {
            const data = await this.getById(item.parentCategoryId);

            if (data instanceof CategoryModel) {
                item.parentCategory = data;
            }
        }

        if (options.loadChildren) {
            const data = await this.getAllByParrentCategoryId(item.categoryId);
            if (Array.isArray(data)) {
                item.subcategories = data;
            }
        }

        return item;
    }

    public async getAll(): Promise<CategoryModel[]|IErrorResponse> {
        return new Promise<CategoryModel[]|IErrorResponse>(async (resolve) => {
            const sql: string = "SELECT * FROM category WHERE parent__category_id IS NULL;";
            this.db.execute(sql)
                .then(async (result) => {
                    const rows = result[0];
                    const lista: CategoryModel[] = [];
                    if (Array.isArray(rows)) {
                        for(const row of rows) {
                            lista.push(
                                await this.adaptModel(
                                    row, {
                                        loadChildren:true,
                                    },
                                )
                            )
                        }
                    }
                    resolve(lista);
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                }); 
        });
    }

    public async getAllByParrentCategoryId(parentCatagoryId: number): Promise<CategoryModel[]|IErrorResponse> {
        try {
            const lista: CategoryModel[] = [];
            const sql: string = "SELECT * FROM category WHERE parent__category_id =?;";
            const [rows , columns] = await this.db.execute(sql, [ parentCatagoryId]);

            if (Array.isArray(rows)) {
                for(const row of rows) {
                    lista.push(
                        await this.adaptModel(
                            row, {
                                loadChildren:true,
                            },
                        )
                    )    
                }
            }

            return lista;
        } catch (error) {
            return {
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
            }

        }    
    }

    public async getById(categoryId:number): Promise<CategoryModel|null|IErrorResponse>{
        return new Promise<CategoryModel|null|IErrorResponse>(async resolve => {
            const sql:string = "SELECT * FROM category WHERE category_id = ?;";
            this.db.execute(sql, [ categoryId ])
                .then(async result => {
                    const [rows , columns] = result;

                    if (!Array.isArray(rows)) {
                        resolve(null);
                        return;
                    }
            
                    if (rows.length === 0) {
                        resolve(null);
                        return;
                    }

                    resolve(await this.adaptModel(
                        rows[0],
                        {
                            loadChildren: true,
                            loadParent : true,
                        }
                    ));
                 })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
            });
        }

}
export default CategoryService;