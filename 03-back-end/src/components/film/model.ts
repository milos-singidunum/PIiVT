import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';

class FilmModel implements IModel {
    filmId: number;
    title: string;
    serbianTitle: string;
    year: string;
    directorName: string;
    description: string;
    picturePath: string;
    categoryId: number;
    category: CategoryModel | null = null;

}

export default FilmModel;