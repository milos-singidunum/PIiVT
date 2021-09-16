import IModel from '../../common/IModel.interface';
import UserModel from '../user/model';
import FilmModel from '../film/model';


export default class ReviewModel implements IModel {
    FilmReviewId: number;
    userId: number;
    filmId: number;
    reviewText: string;
    reviewMark: string;
    user: UserModel;
    film: FilmModel;
}

