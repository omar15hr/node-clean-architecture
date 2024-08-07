import { Router } from "express";
import { AuthRoutes } from "./auth";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definición de rutas principales
    router.use("/api/auth", AuthRoutes.routes);

    return router;
  }
}
