import { PrismaClient } from "@prisma/client";
import { CustomError, RegisterUserDto, UserEntity } from "../../../domain";
import { AuthDatasource } from "../../../domain/datasources/auth/auth.datasouce";
import { BcryptAdapter } from "../../../config";
import { UserMapper } from "../../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDatasourceImpl implements AuthDatasource {

  constructor(
    private readonly hashPassword: HashFunction = BcryptAdapter.hash,
    private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {

    const prisma = await new PrismaClient();
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

  
}
