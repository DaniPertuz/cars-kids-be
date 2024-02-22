import { Router } from 'express';
import { ProductEntity } from '../domain/entities/product.entity';
import { PurchaseEntity } from '../domain/entities/purchase.entity';
import { RentalEntity } from '../domain/entities/rental.entity';
import { UserEntity } from '../domain/entities/user.entity';
import { VehicleEntity } from '../domain/entities/vehicle.entity';

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
  purchaseDate: string;
}

export interface PurchaseQueryResult {
  page:      number;
  limit:     number;
  total:     number;
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
  exception?: string; 
}

export interface RentalQueryResult {
  page:    number;
  limit:   number;
  total:   number;
  next:    string | null;
  prev:    string | null;
  rentals: RentalEntity[];
}

export interface IUser {
  email:    string;
  password: string;
  name:     string;
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
