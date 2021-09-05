import CategoryService from "../components/category/service";
import FilmService from "../components/film/service";
import GenreService from "../components/genre/service";


export default interface IServices {
    categoryService: CategoryService;
    filmService: FilmService;
    genreService: GenreService;
    
}