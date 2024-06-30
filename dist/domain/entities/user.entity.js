"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    constructor(params) {
        this.params = params;
    }
}
exports.UserEntity = UserEntity;
UserEntity.fromObject = (object) => {
    const { _id, email, password, name, img, role, status } = object;
    const user = new UserEntity({ _id, email, password, name, img, role, status });
    return user;
};
