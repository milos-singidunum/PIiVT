import AdministratorService from "../components/administrator/service";
import CategoryService from "../components/category/service";
import FilmService from "../components/film/service";
import GenreService from "../components/genre/service";
import UserService from '../components/user/service';


export default interface IServices {
    categoryService: CategoryService;
    filmService: FilmService;
    genreService: GenreService;
    administratorService: AdministratorService;
    userService: UserService;
    
}