import { PrismaClient } from "@prisma/client";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../../domain";
import { AuthDatasource } from "../../../domain/datasources/auth/auth.datasouce";
import { BcryptAdapter } from "../../../config";
import { UserMapper } from "../../mappers/user.mapper";
import prisma from "../../../lib/prisma";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {

    const { name, email, password } = registerUserDto;

    try {
      // Verify if email already exists
      const emailExists = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (emailExists) {
        throw CustomError.badRequest("Email already exists"); // Debe ser un error genérico
      }

      // Hash password
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: this.hashPassword(password),
        },
      });

      // Mapping the response to UserEntity
      return UserMapper.userEntityFromObject(user);

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }


  async login( loginUserDto: LoginUserDto ): Promise<UserEntity> {
    const { email, password } = loginUserDto;

    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      
      if ( !user ) throw CustomError.badRequest('User does not exists - email');

      const isMatching = this.comparePassword(password, user.password);
      if ( !isMatching ) throw CustomError.badRequest('Password is not valid');

      return UserMapper.userEntityFromObject(user);


    } catch (error) {
      console.log(error); 
      throw CustomError.internalServer();
    }


  }

  
}
