import { Router } from 'express';
import { BudgetEntity, DeskEntity, ProductEntity, PurchaseEntity, RentalEntity, UserEntity, VehicleEntity } from '../domain/entities';

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

export interface IBudget {
  _id?:     string;
  base:     number;
  expenses: number;
  loans:    number;
  payroll:  number;
  date:     string;
}

export interface BudgetQueryResult {
  page:      number;
  limit:     number;
  total:     number;
  next:      string | null;
  prev:      string | null;
  budgets:   BudgetEntity[];
}

export interface IDesk {
  _id?: string;
  name: string;
}

export interface DeskQueryResult {
  page:  number;
  limit: number;
  total: number;
  next:  string | null;
  prev:  string | null;
  desks: DeskEntity[];
}

export interface IProduct {
  _id?:   string;
  name:   string;
  cost:   number;
  price:  number;
  status: IStatus;
}

export interface ProductQueryResult {
  page:     number;
  limit:    number;
  total:    number;
  next:     string | null;
  prev:     string | null;
  products: ProductEntity[];
}

export interface IPurchase {
  _id?:         string;
  product:      string;
  quantity:     number;
  price:        number;
  payment:      IPayment;
  purchaseDate: string;
  user:         string;
  desk:         string;
}

export interface PurchaseQueryResult {
  page:      number;
  limit:     number;
  total:     number;
  sum:       number;
  next:      string | null;
  prev:      string | null;
  purchases: PurchaseEntity[];
}

export interface IRental {
  _id?:       string;
  client:     string;
  time:       number;
  date:       string;
  vehicle:    string;
  payment:    IPayment;
  amount:     number;
  user:       string;
  desk:       string;
  exception?: string; 
}

export interface RentalQueryResult {
  page:    number;
  limit:   number;
  sum:     number;
  total:   number;
  next:    string | null;
  prev:    string | null;
  rentals: RentalEntity[];
}

export interface IUser {
  email:    string;
  password: string;
  name:     string;
  img?:     string;
  role:     IUserRole;
  status:   IStatus;
}

export interface UserQueryResult {
  page:  number;
  limit: number;
  total: number;
  next:  string | null;
  prev:  string | null;
  users: UserEntity[];
}

export interface IVehicle {
  _id?:     string;
  nickname: string;
  category: ICategory;
  color:    string;
  img?:     string;
  size:     IVehicleSize;
  status:   IStatus;
}

export interface VehicleQueryResult {
  page:     number;
  limit:    number;
  total:    number;
  next:     string | null;
  prev:     string | null;
  vehicles: VehicleEntity[];
}

export interface ServerOptions {
  port:         number;
  public_path?: string;
  routes:       Router;
}
