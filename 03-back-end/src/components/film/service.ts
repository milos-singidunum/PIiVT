import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../services/BaseService';
import FilmModel, { FilmGenres } from './model';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import { IAddFilm } from './dto/AddFilm';
import { IEditFilm } from './dto/EditFilm';

class FilmModelAdapterOptions implements IModelAdapterOptions {
    loadCategory: boolean = true;
    loadGenres: boolean = true;
}


class FilmService extends BaseService<FilmModel> {
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
        /*
        if (options.loadCategory && item.categoryId) {
           const result = await this.services.categoryService.getById(item.categoryId);
        
            if (result instanceof CategoryModel) {
                item.category = result;
            }
        }
         */
        if (options.loadCategory) {
            item.category = await this.services.categoryService.getById(item.categoryId) as CategoryModel;
        }

        if (options.loadGenres) {
            item.genres = await this.getAllGenresByFilmId(item.filmId);
        }
        

        return item;
    }

    private async getAllGenresByFilmId(filmId: number): Promise<FilmGenres[]> {
        const sql = `
            SELECT
                film_genre.genre_id,
                genre.name
            FROM
                film_genre
            INNER JOIN genre ON genre.genre_id = film_genre.genre_id
            WHERE
                film_genre.film_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ filmId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: FilmGenres[] = [];

        for (const row of rows as any) {
            items.push({
                genreId: +(row?.genre_id),
                name: row?.name,
            });
        }

        return items;
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