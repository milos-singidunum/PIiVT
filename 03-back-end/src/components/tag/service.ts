import BaseService from '../../services/BaseService';
import IErrorResponse from '../../common/IErrorResponse.intefrace';
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import TagModel from './model';
import { IAddTag } from './dto/IAddTag';
import { IEditTag } from './dto/IEditTag';

class TagModelAdapterOptions implements IModelAdapterOptions { }

class TagService extends BaseService<TagModel>{
    
    protected async adaptModel(
        data: any,
        options: Partial<TagModelAdapterOptions> = {}
    ): Promise<TagModel> {
        const item: TagModel = new TagModel();

        item.tagId = +(data?.tag_id);
        item.name = data?.name;

        return item;
    }

    public async getAll(
        options: Partial<TagModelAdapterOptions> = {},
    ): Promise<TagModel[]|IErrorResponse> {
        return await this.getAllFromTable<TagModelAdapterOptions>('tag', options,);
    }

    public async getById(
        tagId: number,
        options: Partial<TagModelAdapterOptions> = { },
    ): Promise<TagModel|null|IErrorResponse> {
        return await this.getByIdFromTable("tag", tagId, options);
    }

    public async add(data:IAddTag): Promise<TagModel|IErrorResponse> {
        return new Promise<TagModel|IErrorResponse>(resolve => {
            const sql = "INSERT tag SET name = ?;";
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
        tagId: number,
        data: IEditTag,
        options: Partial<TagModelAdapterOptions> = { },
    ): Promise<TagModel|IErrorResponse> {
        return new Promise<TagModel|IErrorResponse>(resolve => {
            const sql = "UPDATE tag SET name = ? WHERE tag_id = ?;";
            this.db.execute(sql, [ data.name, tagId ])
                .then(async result => {
                    resolve(await this.getById(tagId, options));
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

export default TagService;

    
       