import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../services/BaseService';
import FilmModel from './model';
import * as mysql2 from 'mysql2/promise';
import CategoryService from '../category/service';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import { IAddFilm } from './dto/AddFilm';
import { IEditFilm } from './dto/EditFilm';

class FilmModelAdapterOptions implements IModelAdapterOptions {
    loadCategory: boolean = false;
}


class FilmService extends BaseService<FilmModel> {
    private CategoryService: CategoryService;
    constructor(db: mysql2.Connection) {
        super(db);
        this.CategoryService = new CategoryService(this.db);
    }

    protected async adaptModel(
        data: any,
        options: Partial<FilmModelAdapterOptions>
    ): Promise<FilmModel> {
        const item: FilmModel = new FilmModel();

        item.filmId = +(data?.film_id);
        item.title = data?.title;
        item.serbianTitle = data?.serbian_title;
        item.year = data?.year;
        item.directorName = data?.director_name;
        item.description = data?.description;
        item.picturePath = data?.picture_path;
        item.categoryId = +(data?.category_id);

        if (options.loadCategory && item.categoryId) {
           const result = await this.CategoryService.getById(item.categoryId);
        
            if (result instanceof CategoryModel) {
                item.category = result;
            }
        }

        return item;
    }

    public async getById(
        filmId: number,
        options: Partial<FilmModelAdapterOptions> = {}
    ): Promise<FilmModel|null|IErrorResponse> {
        return await this.getByIdFromTable("film" , filmId, options);
    }

    public async getAll(
        options: Partial<FilmModelAdapterOptions> = {},
    ): Promise<FilmModel[]|IErrorResponse> {
        return await this.getAllFromTable<FilmModelAdapterOptions>(
            'film' ,
            options,
             );
    }

    public async getAllByCategoryId(
        categoryId:number,
        options: Partial<FilmModelAdapterOptions> = { },
    ): Promise<FilmModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable("film", "category_id" , categoryId , options);
    }

    public async add(data: IAddFilm): Promise<FilmModel|IErrorResponse> {
        return new Promise<FilmModel|IErrorResponse>(resolve => {
            const sql = "INSERT film SET title = ? , serbian_title = ? , year = ? , director_name = ? , description = ? , picture_path = ? , category_id = ?;";
            this.db.execute(sql , [
                data.title , 
                data.serbianTitle , 
                data.year , 
                data.directorName , 
                data.description , 
                data.picturePath , 
                data.categoryId])
                    .then(async result => {
                        const insertInfo: any = result[0];
                        const newId: number = +(insertInfo?.insertId);
                        resolve(await this.getById(newId));
                    })
                    .catch(error => {
                        resolve({
                            errorCode : error?.errno,
                            errorMessage:  error?.sqlMessage
                        });
                    })
        })
    }

    public async edit(
        filmId: number,
        data: IEditFilm,
        options: Partial<FilmModelAdapterOptions> = { },
    ): Promise<FilmModel|IErrorResponse> {
        return new Promise<FilmModel|IErrorResponse>(resolve => {
            const sql = `
                UPDATE 
                    film 
                 SET 
                    title = ? , 
                    serbian_title = ? ,
                    year = ? , 
                    director_name = ? , 
                    description = ? , 
                    picture_path = ?
                 WHERE 
                    film_id = ?;`;
            this.db.execute(sql , [
                data.title , 
                data.serbianTitle , 
                data.year , 
                data.directorName , 
                data.description , 
                data.picturePath ])
                .then(async result => {
                    resolve(await this.getById(filmId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }
}

export default FilmService;