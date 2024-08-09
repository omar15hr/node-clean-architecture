import { Jwt } from "../../../config";
import { LoginUserDto } from "../../dtos/auth/login-user.dto";
import { CustomError } from "../../errors/custom.error";
import { AuthRepository } from "../../repositories/auth/auth.repository";

interface UserToken {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  }
}

interface LoginUserUseCase {
  execute( loginUserDto: LoginUserDto ): Promise<UserToken>;
}

type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

export class LoginUser implements LoginUserUseCase {

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly signToken: SignToken = Jwt.generateToken,
  ) {}

  async execute(loginUserDto: LoginUserDto): Promise<UserToken> {
    
    // Create user
    const user = await this.authRepository.login(loginUserDto);

    // Token
    const token = await this.signToken({ id: user.id }, '2h');
    if (!token) throw CustomError.internalServer('Token error');

    return {
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    }

  }

}