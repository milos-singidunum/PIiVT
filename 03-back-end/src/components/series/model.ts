import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';

class SeriesGenre implements IModel {
    genreId: number;
    name?: string;
}

class Episodes implements IModel {
    episodeId: number;
    season : string;
    episodeName: string;
    episodeNum: string;
    description: string;
}


class SeriesModel implements IModel {
    showId: number;
    title: string;
    serbianTitle: string;
    year: string;
    directorName: string;
    description: string;
    imagePath: string;
    categoryId: number;
    category?: CategoryModel;
    genres: SeriesGenre[] = [];
    episodes: Episodes[] = [];

}

export default SeriesModel;

export { SeriesGenre };
export { Episodes }