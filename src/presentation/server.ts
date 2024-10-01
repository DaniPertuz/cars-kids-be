import express, { Router } from 'express';
import path from 'path';
import { connect } from '../database';
import { ServerOptions } from '../interfaces';

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: ServerOptions) {
    const { port, public_path = 'public', routes } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }

  async connectionDB() {
    await connect();
  }

  async start() {

    this.connectionDB();

    // Middlewares
    this.app.use(express.json()); // raw
    this.app.use(express.urlencoded({ extended: true })); // x-www-form-url-encoded

    // Public folder
    this.app.use(express.static(this.publicPath));

    // Routes
    this.app.use(this.routes);

    // SPA
    this.app.get('*', (req, res) => {
      const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
      res.sendFile(indexPath);
    });

    this.serverListener = this.app.listen(this.port, '0.0.0.0', () => {
      console.log(`Server running on port ${this.port}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
