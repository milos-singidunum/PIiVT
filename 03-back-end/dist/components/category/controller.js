"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.categoryService.getAll();
            res.send(categories);
        });
    }
    getById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const categoryId = +id;
            if (categoryId <= 0) {
                res.sendStatus(400);
                return;
            }
            const category = yield this.categoryService.getById(+id);
            if (category === null) {
                res.sendStatus(404);
                return;
            }
            res.send(category);
        });
    }
}
exports.default = CategoryController;
//# sourceMappingURL=controller.js.map