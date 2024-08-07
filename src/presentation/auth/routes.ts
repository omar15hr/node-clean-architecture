import { Router } from "express";

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();

    // Definición de rutas del modulo de autenticación
    router.post("/login", (req, res) => {
      res.json("Login");
    });

    router.post("/register", (req, res) => {
      res.json("Register");
    });

    return router;
  }
}
