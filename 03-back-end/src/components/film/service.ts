import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../services/BaseService';
import FilmModel, { FilmGenres } from './model';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import { IAddFilm, UploadFilmPhoto } from './dto/AddFilm';


class FilmModelAdapterOptions implements IModelAdapterOptions {
    loadCategory: boolean = true;
    loadGenres: boolean = true;
    loadPhotos: boolean = false;
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
        item.categoryId = +(data?.category_id);
    

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
        options: Partial<FilmModelAdapterOptions> = {},
    ): Promise<FilmModel|IErrorResponse|null> {
        return  this.getByIdFromTable("film" , filmId, options);
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
    

    public async add(
        data: IAddFilm,
        uploadedPhotos: UploadFilmPhoto[],
    ): Promise<FilmModel|IErrorResponse> {
        return new Promise<FilmModel|IErrorResponse>(resolve => {
            this.db.beginTransaction()
            .then( () => {
               this.db.execute(
                   `INSERT film
                    SET 
                    title =           ?,
                    serbian_title =   ?,
                    year =            ?,
                    director_name =   ?, 
                    description =     ?,
                    category_id =     ?; 
                `,
                [
                    data.title,
                    data.serbianTitle,
                    data.year,
                    data.directorName,
                    data.description,
                    data.categoryId,
                ]
                ).then(async (res: any) => {
                    const newFilmId: number = +(res[0]?.insertId);
                    
                    const promises = [];

                    for (const filmGenre of data.genres) {
                        promises.push(
                            this.db.execute(
                                `INSERT film_genre
                                SET film_id = ? ,  genre_id = ?;`,
                                [newFilmId , filmGenre.genreId ]
                            ),
                        );
                    } 

                    for (const uploadPhoto of uploadedPhotos) {
                        promises.push(
                            this.db.execute(
                                `INSERT photo SET film_id = ? , image_path = ?;`,
                                [newFilmId, uploadPhoto.imagePath,]
                            ),
                        );
                    }

                    Promise.all(promises)
                    .then(async () => {
                        await this.db.commit();

                        resolve(await this.services.filmService.getById(
                            newFilmId,
                            {
                                loadCategory: true,
                                loadGenres: true,
                                loadPhotos: true,
                        
                            } 
                        ))
                    })
                    .catch(async error => {
                        await this.db.rollback();
    
                        resolve({
                            errorCode : error?.errno,
                            errorMessage:  error?.sqlMessage
                        });
                    })
                }) 
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode : error?.errno,
                        errorMessage:  error?.sqlMessage
                    });
                })
            });
        });
    }

/*
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
    } */
}

export default FilmService;