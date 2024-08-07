import { CustomError, RegisterUserDto, UserEntity } from "../../../domain";
import { AuthDatasource } from "../../../domain/datasources/auth/auth.datasouce";

export class AuthDatasourceImpl implements AuthDatasource {

  async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    
    const { name, email, password } = registerUserDto;

    try {
      
      // Verify if email already exists
      // Hash password
      // Mapping the response to UserEntity

      return new UserEntity(
        '1',
        name,
        email,
        password,
        ['ADMIN_ROLE']
      )

    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();

    }
  }
}