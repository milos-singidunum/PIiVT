import IErrorResponse from "../../common/IErrorResponse.intefrace";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import BaseService from "../../services/BaseService";
import ReviewModel from "./model";

export class FilmReviewModelAdapterOptions implements IModelAdapterOptions {

}

class FilmReviewService extends BaseService<ReviewModel> {
     protected async adaptModel(
        data: any,
        options: Partial<FilmReviewModelAdapterOptions>
    ): Promise<ReviewModel> {
        const item: ReviewModel = new ReviewModel();

        item.FilmReviewId = +(data?.film_review_id);
        item.filmId = +(data?.film_id);
        item.userId = +(data?.user_id);
        item.reviewText = data?.review_text;
        item.reviewMark = data?.review_mark;
    
        

        return item;
    }

    public async getById(
        FilmReviewId: number,
        options: Partial<FilmReviewModelAdapterOptions> = {},
    ): Promise<ReviewModel|IErrorResponse|null> {
        return  this.getByIdFromTable("film_review" , FilmReviewId, options);
    }

    public async getAll(
        options: Partial<FilmReviewModelAdapterOptions> = {},
    ): Promise<ReviewModel[]|IErrorResponse> {
        return await this.getAllFromTable<FilmReviewModelAdapterOptions>(
            'review' ,
            options,
             );
    }

    public async getAllByUserId(
        userId:number,
        options: Partial<FilmReviewModelAdapterOptions> = { },
    ): Promise<ReviewModel[]|IErrorResponse> {
        return await this.getAllByFieldNameFromTable("film_review", "user_id" , userId , options);
    }

}

export default FilmReviewService;