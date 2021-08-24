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
class CategoryService {
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const lista = [];
            lista.push({
                categoryId: 1,
                name: "Category A",
                imagePath: "static/categories/1.png",
                parentCategoryId: null,
                parentCategory: null,
                subcategories: [],
            });
            lista.push({
                categoryId: 2,
                name: "Category B",
                imagePath: "static/categories/2.png",
                parentCategoryId: null,
                parentCategory: null,
                subcategories: [],
            });
            return lista;
        });
    }
    getById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (categoryId === 1 || categoryId === 2) {
                if (categoryId === 1) {
                    return {
                        categoryId: 1,
                        name: "Category A",
                        imagePath: "static/categories/1.png",
                        parentCategoryId: null,
                        parentCategory: null,
                        subcategories: [],
                    };
                }
                if (categoryId === 2) {
                    return {
                        categoryId: 2,
                        name: "Category B",
                        imagePath: "static/categories/2.png",
                        parentCategoryId: null,
                        parentCategory: null,
                        subcategories: [],
                    };
                }
            }
            else {
                return null;
            }
        });
    }
}
exports.default = CategoryService;
//# sourceMappingURL=service.js.map