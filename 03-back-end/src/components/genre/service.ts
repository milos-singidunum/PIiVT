import BaseService from '../../services/BaseService';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import GenreModel from './model';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import { IAddGenre } from './dto/AddGenre';
import { IEditGenre } from './dto/EditGenre';

class GenreModelAdapterOptions implements IModelAdapterOptions { }

class GenreService extends BaseService<GenreModel>{
    
    protected async adaptModel(
        data: any,
        options: Partial<GenreModelAdapterOptions> = {}
    ): Promise<GenreModel> {
        const item: GenreModel = new GenreModel();

        item.genreId = +(data?.genre_id);
        item.name = data?.name;

        return item;
    }

    public async getAll(
        options: Partial<GenreModelAdapterOptions> = {},
    ): Promise<GenreModel[]|IErrorResponse> {
        return await this.getAllFromTable<GenreModelAdapterOptions>('genre', options,);
    }

    public async getById(
        genreId: number,
        options: Partial<GenreModelAdapterOptions> = { },
    ): Promise<GenreModel|null|IErrorResponse> {
        return await this.getByIdFromTable("genre", genreId, options);
    }

    public async add(data:IAddGenre): Promise<GenreModel|IErrorResponse> {
        return new Promise<GenreModel|IErrorResponse>(resolve => {
            const sql = "INSERT genre SET name = ?;";
            this.db.execute(sql , [ data.name ])
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
        genreId: number,
        data: IEditGenre,
        options: Partial<GenreModelAdapterOptions> = { },
    ): Promise<GenreModel|IErrorResponse> {
        return new Promise<GenreModel|IErrorResponse>(resolve => {
            const sql = "UPDATE genre SET name = ? WHERE genre_id = ?;";
            this.db.execute(sql, [ data.name, genreId ])
                .then(async result => {
                    resolve(await this.getById(genreId, options));
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

export default GenreService;

    
       