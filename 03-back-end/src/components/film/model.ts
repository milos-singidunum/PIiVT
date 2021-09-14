import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';

class FilmGenres implements IModel {
    genreId: number;
    name?: string;
}

class FilmTags implements IModel {
    tagId: number;
    name?: string;
}

class Photo implements IModel {
    photoId: number;
    imagePath: string;
}

class FilmModel implements IModel {
    filmId: number;
    title: string;
    serbianTitle: string;
    year: string;
    directorName: string;
    description: string;
    categoryId: number;
    category?: CategoryModel;
    photos: Photo[] = [];
    genres: FilmGenres[] = [];
    tags: FilmTags[] = [];

}

export default FilmModel;
export { Photo as FilmPhoto };
export { FilmGenres };
export { FilmTags };