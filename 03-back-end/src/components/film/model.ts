import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';

class FilmGenres implements IModel {
    genreId: number;
    name?: string;
}

class FilmModel implements IModel {
    filmId: number;
    title: string;
    serbianTitle: string;
    year: string;
    directorName: string;
    description: string;
    picturePath: string;
    categoryId: number;
    category?: CategoryModel;
    genres: FilmGenres[] = [];

}

export default FilmModel;
export { FilmGenres };