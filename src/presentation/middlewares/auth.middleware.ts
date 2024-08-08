import { NextFunction, Request, Response } from "express";
import { Jwt } from "../../config";
import prisma from "../../lib/prisma";

export class AuthMiddleware {

  static validateJWT = async(req: Request, res: Response, next: NextFunction) => {

    const authorization = req.header('Authorization');
    if (!authorization) return res.status(401).json({ error: 'No token provided' });
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Invalid Bearer token' });

    const token = authorization.split(' ').at(1) || '';

    try {

      const payload = await Jwt.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: 'Invalid token' });

      const user = await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) return res.status(401).json({ error: 'Invalid token' });

      req.body.user = user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

  }

}