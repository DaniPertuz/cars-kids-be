import { Router } from 'express';

export enum ICategory {
  Car   = 'car',
  Cycle = 'cycle'
}

export enum IPayment {
  Cash        = 'cash',
  Nequi       = 'nequi',
  Bancolombia = 'bancolombia',
  Daviplata   = 'daviplata'
}

export enum IStatus {
  Active   = 'active',
  Inactive = 'inactive'
}

export enum IUserRole {
  Admin  = 'admin',
  Editor = 'editor'
}

export enum IVehicleSize {
  Small  = 'S',
  Medium = 'M',
  Large  = 'L'
}

export interface IProduct {
  name:    string;
  payment: IPayment;
  amount:  number;
  status:  IStatus;
}

export interface IRental {
  _id?:       string;
  client:     string;
  time:       number;
  date:       string;
  vehicle:    string;
  payment:    IPayment;
  amount:     number;
  exception?: string; 
}

export interface IUser {
  email:    string;
  password: string;
  name:     string;
  role:     IUserRole;
  status:   IStatus;
}

export interface IVehicle {
  nickname: string;
  category: ICategory;
  color:    string;
  img?:     string;
  size:     IVehicleSize;
  status:   IStatus;
}

export interface ServerOptions {
  port:         number;
  public_path?: string;
  routes:       Router;
}
