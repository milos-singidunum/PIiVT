"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Config = {
    server: {
        port: 40080,
        static: {
            route: "/static",
            path: "./static/",
            cacheControl: false,
            dotfiles: "deny",
            etag: false,
            index: false,
            maxAge: 360000,
        }
    },
};
exports.default = Config;
//# sourceMappingURL=dev.js.map