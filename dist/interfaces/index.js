"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IVehicleSize = exports.IUserRole = exports.IStatus = exports.IPayment = exports.ICategory = void 0;
var ICategory;
(function (ICategory) {
    ICategory["Car"] = "car";
    ICategory["Cycle"] = "cycle";
})(ICategory || (exports.ICategory = ICategory = {}));
var IPayment;
(function (IPayment) {
    IPayment["Cash"] = "cash";
    IPayment["Nequi"] = "nequi";
    IPayment["Bancolombia"] = "bancolombia";
    IPayment["Daviplata"] = "daviplata";
})(IPayment || (exports.IPayment = IPayment = {}));
var IStatus;
(function (IStatus) {
    IStatus["Active"] = "active";
    IStatus["Inactive"] = "inactive";
})(IStatus || (exports.IStatus = IStatus = {}));
var IUserRole;
(function (IUserRole) {
    IUserRole["Admin"] = "admin";
    IUserRole["Editor"] = "editor";
})(IUserRole || (exports.IUserRole = IUserRole = {}));
var IVehicleSize;
(function (IVehicleSize) {
    IVehicleSize["Small"] = "S";
    IVehicleSize["Medium"] = "M";
    IVehicleSize["Large"] = "L";
    IVehicleSize["XLarge"] = "XL";
})(IVehicleSize || (exports.IVehicleSize = IVehicleSize = {}));
