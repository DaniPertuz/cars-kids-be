import { Router } from 'express';
import { ProductsController } from './controllers';

export class ProductsRoutes {
  static get routes(): Router {
    const router = Router();

    const { createProduct, deleteProduct, getProduct, getAllProducts, getProductsByStatus, updateProduct } = new ProductsController();

    router.get('/', getAllProducts);
    router.get('/status/:status', getProductsByStatus);
    router.get('/:name', getProduct);
    router.post('/', createProduct);
    router.put('/:name', updateProduct);
    router.delete('/:name', deleteProduct);

    return router;
  }
}
