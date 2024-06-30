"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("./controllers");
const auth_middleware_1 = require("../middlewares/auth.middleware");
class UsersRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const { getUsers, updateUserName, updateUserImage, updateUserEmail, updateUserPassword, updateUserRole, updateUserStatus, deactivateUser } = new controllers_1.UsersController();
        router.get('/', [auth_middleware_1.AuthMiddleware.validateJWT], getUsers);
        router.put('/name', updateUserName);
        router.put('/image', updateUserImage);
        router.put('/email', updateUserEmail);
        router.put('/password', updateUserPassword);
        router.put('/role', [auth_middleware_1.AuthMiddleware.validateJWT], updateUserRole);
        router.put('/status', [auth_middleware_1.AuthMiddleware.validateJWT], updateUserStatus);
        router.delete('/', [auth_middleware_1.AuthMiddleware.validateJWT], deactivateUser);
        return router;
    }
}
exports.UsersRoutes = UsersRoutes;
