"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const dev_1 = require("./config/dev");
const router_1 = require("./components/category/router");
const application = express();
application.use(cors());
application.use(express.json());
application.get("/about", (req, res) => {
    res.send({
        "title": "About us",
        "content": "<p> About us... </p>"
    });
});
application.use(dev_1.default.server.static.route, express.static(dev_1.default.server.static.path, {
    index: dev_1.default.server.static.index,
    cacheControl: dev_1.default.server.static.cacheControl,
    maxAge: dev_1.default.server.static.maxAge,
    etag: dev_1.default.server.static.etag,
    dotfiles: dev_1.default.server.static.dotfiles
}));
router_1.default.setupRoutes(application);
application.use((req, res) => {
    res.sendStatus(404);
});
application.listen(dev_1.default.server.port);
//# sourceMappingURL=main.js.map