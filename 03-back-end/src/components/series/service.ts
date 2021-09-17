import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from '../../services/BaseService';
import CategoryModel from '../category/model';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import SeriesModel, { SeriesGenre  } from './model';
import {Episodes} from './model';
import { IAddSeries } from './dto/IAddSeries';
import { IEditSeries } from './dto/IEditSeries';
import { IAddEpisodes } from './dto/IAddEpisode';

class SeriesModelAdapterOptions implements IModelAdapterOptions {
    loadCategory: boolean = true;
    loadGenres: boolean = true;
    loadEpisodes : boolean = true;
}


class SeriesService extends BaseService<SeriesModel> {
     protected async adaptModel(
        data: any,
        options: Partial<SeriesModelAdapterOptions>
    ): Promise<SeriesModel> {
        const item: SeriesModel = new SeriesModel();

        item.showId = +(data?.tv_show_id);
        item.title = data?.title;
        item.serbianTitle = data?.serbian_title;
        item.year = data?.year;
        item.directorName = data?.director_name;
        item.description = data?.description;
        item.imagePath = data?.image_path;
        item.categoryId = +(data?.category_id);
    

        if (options.loadCategory) {
            item.category = await this.services.categoryService.getById(item.categoryId) as CategoryModel;
        }

        if (options.loadGenres) {
            item.genres = await this.getAllGenresBySeriesId(item.showId);
        }

       if (options.loadEpisodes) {
            item.episodes = await this.getAllEpisodesBySeriesId(item.showId);
        }
        

        return item;
    }

    private async getAllGenresBySeriesId(showId: number): Promise<SeriesGenre[]> {
        const sql = `
            SELECT
                show_genre.genre_id,
                genre.name
            FROM
                show_genre
            INNER JOIN genre ON genre.genre_id = show_genre.genre_id
            WHERE
                show_genre.tv_show_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ showId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: SeriesGenre[] = [];

        for (const row of rows as any) {
            items.push({
                genreId: +(row?.genre_id),
                name: row?.name,
            });
        }

        return items;
    }

    private async getAllEpisodesBySeriesId(showId: number): Promise<Episodes[]> {
        const sql = `
            SELECT
                *
            FROM
                episodes
            WHERE
                tv_show_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ showId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        const items: Episodes[] = [];

        for (const row of rows as any) {
            items.push({
                episodeId: +(row?.episodes_id),
                episodeNum: row?.episode_num,
                season: row?.season,
                description: row?.description,
                episodeName: row?.episode_name,
            });
        }

        return items;
    } 

    public async getById(
        showId: number,
        options: Partial<SeriesModelAdapterOptions> = {},
    ): Promise<SeriesModel|IErrorResponse|null> {
        return  this.getByIdFromTable("tv_show" , showId, options);
    }

    public async getAll(
        options: Partial<SeriesModelAdapterOptions> = {},
    ): Promise<SeriesModel[]|IErrorResponse> {
        return await this.getAllFromTable<SeriesModelAdapterOptions>(
            'tv_show' ,
            options,
             );
    }

    public async getAllByCategoryId(
        categoryId:number,
        options: Partial<SeriesModelAdapterOptions> = { },
    ): Promise<SeriesModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable("tv_show", "category_id" , categoryId , options);
    }


    

    public async add(
        data: IAddSeries,
    ): Promise<SeriesModel|IErrorResponse> {
        return new Promise<SeriesModel|IErrorResponse>(resolve => {
            this.db.beginTransaction()
            .then( () => {
               this.db.execute(
                   `INSERT tv_show
                    SET 
                    title =           ?,
                    serbian_title =   ?,
                    year =            ?,
                    director_name =   ?, 
                    description =     ?,
                    image_path  =     ?,
                    category_id =     ?; 
                `,
                [
                    data.title,
                    data.serbianTitle,
                    data.year,
                    data.directorName,
                    data.description,
                    data.imagePath,
                    data.categoryId,
                ]
                ).then(async (res: any) => {
                    const newShowId: number = +(res[0]?.insertId);
                    
                    const promises = [];

                    for (const showGenre of data.genres) {
                        promises.push(
                            this.db.execute(
                                `INSERT show_genre
                                SET tv_show_id = ? ,  genre_id = ?;`,
                                [newShowId , showGenre.genreId ]
                            ),
                        );
                    } 

                    Promise.all(promises)
                    .then(async () => {
                        await this.db.commit();

                        resolve(await this.services.seriesService.getById(
                            newShowId,
                            {
                                loadCategory: true,
                                loadGenres: true,
                        
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

    public async addSeriesWithEpisodes(
        data: IAddEpisodes,
    ): Promise<SeriesModel|IErrorResponse> {
        return new Promise<SeriesModel|IErrorResponse>(resolve => {
            this.db.beginTransaction()
            .then( () => {
               this.db.execute(
                   `INSERT tv_show
                    SET 
                    title =           ?,
                    serbian_title =   ?,
                    year =            ?,
                    director_name =   ?, 
                    description =     ?,
                    image_path  =     ?,
                    category_id =     ?; 
                `,
                [
                    data.title,
                    data.serbianTitle,
                    data.year,
                    data.directorName,
                    data.description,
                    data.imagePath,
                    data.categoryId,
                ]
                ).then(async (res: any) => {
                    const newShowId: number = +(res[0]?.insertId);
                    
                    const promises = [];

                    for (const showEpisodes of data.episodes) {
                        promises.push(
                            this.db.execute(
                                `INSERT episodes
                                SET 
                                season = ? ,
                                episode_name = ?,
                                episode_num = ?,
                                description = ?;`,
                                [newShowId , showEpisodes.season,
                                showEpisodes.episodeName,showEpisodes.episodeNum,
                                showEpisodes.description ]
                            ),
                        );
                    } 

                    Promise.all(promises)
                    .then(async () => {
                        await this.db.commit();

                        resolve(await this.services.seriesService.getById(
                            newShowId,
                            {
                                loadCategory: true,
                                loadGenres: true,
                                loadEpisodes: true,
                        
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

    private editSeries(filmId: number, data: IEditSeries) {
        return this.db.execute(
            `UPDATE
                tv_show
            SET
                title =           ?,
                serbian_title =   ?,
                year =            ?,
                director_name =   ?, 
                image_path =      ?,
                description =     ?,
                category_id =     ?
            WHERE
                tv_show_id = ?;`,
            [
                data.title,
                data.serbianTitle,
                data.year,
                data.directorName,
                data.description,
                data.imagePath,
                data.categoryId,
                filmId
            ]
        );
    }

    private deleteSeriesGenre(showId: number, genreId: number) {
        return this.db.execute(
            `DELETE FROM
                show_genre
            WHERE
                tv_show_id = ? AND
                genre_id = ?;`,
            [
                showId,
                genreId,
            ]
        );
    }

    private addNewGenres(showId: number, ng: SeriesGenre) {
        return this.db.execute(
            `INSERT
                show_genre
            SET
                tv_show_id = ?,
                genre_id = ?;`,
            [
                showId,
                ng.genreId,
            ],
        );
    }

    public async edit(showId: number, data: IEditSeries):Promise<SeriesModel|null|IErrorResponse> {
        return  new Promise<SeriesModel|null|IErrorResponse>(async resolve => {
            const currentSeries = await this.getById(showId,{
                loadGenres: true,
            });

            if (currentSeries === null) {
                return resolve(null);
                
            }

            const rollbackAndResolve = async (error) => {
                await this.db.rollback();
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            }

            this.db.beginTransaction()
                .then(async () => {
                     this.editSeries(showId , data)
                    .catch( error => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: "Part series: " + error?.sqlMessage,
                        });
                    })
                })  
                .then(async () => {
                    const willHaveGenres = data.genres.map(whg => whg.genreId);
                    const currentGenres = (currentSeries as SeriesModel).genres.map(cg => cg.genreId)

                        for (const currentGenre of currentGenres ) {
                            if(!willHaveGenres.includes(currentGenre)) {
                                this.deleteSeriesGenre(showId, currentGenre)
                                .catch(error => {
                                    rollbackAndResolve({
                                        errno: error?.errno,
                                        sqlMessage: `Part delete genre id(${currentGenre}):${error?.sqlMessage}`
                                    });
                                });
                    
                            }
                        }

                    })
                    .then(async () => {
                        for (const ag of data.genres) {
                            this.addNewGenres(showId, ag)
                            .catch(error => {
                                rollbackAndResolve({
                                    errno: error?.errno,
                                    sqlMessage: `Part add genre id(${ag.genreId}):${error?.sqlMessage}`
                                });
                            });
                        }
                    })
                    .then(async () => {
                        this.db.commit()
                        .catch(error => {
                            rollbackAndResolve({
                                errno: error?.errno,
                                sqlMessage: `Part save changes: ${error?.sqlMessage}`,
                            });
                        });
                    })
                    .then(async () => {
                        resolve(await this.getById(showId, {
                            loadCategory: true,
                            loadGenres: true,
                        }));
                    })
                    .catch(async error => {
                        await this.db.rollback();
    
                        resolve({
                            errorCode : error?.errno,
                            errorMessage:  error?.sqlMessage
                        });
                    });

            });
        }

        public async delete(showId: number):Promise<IErrorResponse|null> {
            return new Promise<IErrorResponse>(async resolve => {
                const currentFilm = await this.getById(showId, {
                    loadCategory: true,
                    loadGenres: true,
                });

                if (currentFilm === null) {
                    return resolve(null);
                }

                this.db.beginTransaction()
                
                .then(async () => {
                    if (await this.deleteSeriesGenres(showId)) return;
                    throw { errno: -1003, sqlMessage: "You can't delete genres for this tv show", };
                })

                .then(async(filesToDelete) => {
                   if (await this.deleteSeriesRecord(showId)) return filesToDelete;
                   throw { errno: -1006, sqlMessage: "Could not delete the series records.", };
                })
                .then(async (filesToDelete) => {
                    await this.db.commit();
                    return filesToDelete;
                })
                .then( () => {
                    resolve({
                        errorCode: 0,
                        errorMessage: "TV show is success deleted!"
                    });
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

        private async deleteSeriesGenres(showId: number): Promise<boolean> {
            return new Promise<boolean>(async resolve => {
                this.db.execute(
                    `DELETE FROM show_genre WHERE tv_show_id = ?;`,
                    [ showId ]
                )
                .then(() => resolve(true))
                .catch(() => resolve(false));
            });
        }

        private async deleteSeriesRecord(showId: number): Promise<boolean> {
            return new Promise<boolean>(async resolve => {
                this.db.execute(
                    `DELETE FROM tv_show WHERE tv_show_id = ?;`,
                    [ showId ]
                )
                .then(() => resolve(true))
                .catch(() => resolve(false));
            });
        }
}

export default SeriesService;