"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
const controller_1 = require("./controller");
class CategoryRouter {
    static setupRoutes(application) {
        const categoryService = new service_1.default();
        const categoryController = new controller_1.default(categoryService);
        application.get("/category", categoryController.getAll.bind(categoryController));
        application.get("/category/:id", categoryController.getById.bind(categoryController));
    }
}
exports.default = CategoryRouter;
//# sourceMappingURL=router.js.map