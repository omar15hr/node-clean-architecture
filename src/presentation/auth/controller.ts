import { Request, Response } from "express";
import { AuthRepository, CustomError, RegisterUser, RegisterUserDto, LoginUserDto } from "../../domain";
import prisma from "../../lib/prisma";
import { LoginUser } from "../../domain/use-cases/auth/login-user.use-case";

export class AuthController {

  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  private handleError = ( error: unknown, res: Response ) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(error); //Winston o cualquier otro logger
    return res.status(500).json({ error: "Internal Server Error" });
  };


  registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new RegisterUser(this.authRepository)
      .execute(registerUserDto!)
      .then( (data) => res.json(data) )
      .catch(error => this.handleError(error, res));
  };


  loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    new LoginUser(this.authRepository)
      .execute(loginUserDto!)
      .then( (data) => res.json(data) )
      .catch(error => this.handleError(error, res));
  };

  getUser = async(req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      res.json({
        user: req.body.user,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

}
