"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
class UserRepositoryImpl {
    constructor(userDatasource) {
        this.userDatasource = userDatasource;
    }
    getUsers(paginationDto) {
        return this.userDatasource.getUsers(paginationDto);
    }
    updateUserImage(email, img) {
        return this.userDatasource.updateUserImage(email, img);
    }
    updateUserName(email, name) {
        return this.userDatasource.updateUserName(email, name);
    }
    updateUserEmail(email, newEmail) {
        return this.userDatasource.updateUserEmail(email, newEmail);
    }
    updateUserPassword(email, password) {
        return this.userDatasource.updateUserPassword(email, password);
    }
    updateUserStatus(email, status) {
        return this.userDatasource.updateUserStatus(email, status);
    }
    updateUserRole(email, role) {
        return this.userDatasource.updateUserRole(email, role);
    }
    deactivateUser(email) {
        return this.userDatasource.deactivateUser(email);
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
