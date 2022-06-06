import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { User } from 'src/users/users.schema';
import { UserDto } from '../users/dto/user.dto';

// -----------------------------------------------------------------------------

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  /**
   * Login user
   */
  async loginLocal(user: AuthDto): Promise<Tokens> {
    const { email, password } = user;

    const _user = await this.usersService.getOneLogin({ email });

    if (!_user)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const passwordMatch = await bcrypt.compare(password, _user.password);

    if (!passwordMatch)
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);

    const tokens = await this.createTokens(_user);
    await this.updateRtHash(user.email, tokens.refresh_token);
    return tokens;
  }

  /**
   * Get Account
   */
  async account(email: string): Promise<User> {
    return await this.usersService.getOne({ email });
  }

  /**
   * Logout user
   */
  // TODO: Response false when 200 ok
  async logout(email: string): Promise<boolean> {
    const result = await this.usersService.updateOne(
      { email },
      {
        hash: null,
      },
    );

    return result.upsertedCount > 0;
  }

  /**
   * Refresh Token
   */
  async refresh(email: string, rt: string): Promise<Tokens> {
    const user = await this.usersService.getOneLogin({ email });

    if (!user || !user.hash)
      throw new HttpException('Access Denied', HttpStatus.BAD_REQUEST);

    const rtMatches = await bcrypt.compare(rt, user.hash);

    if (!rtMatches)
      throw new HttpException('Access Denied', HttpStatus.BAD_REQUEST);

    const tokens = await this.createTokens(user);
    await this.updateRtHash(email, tokens.refresh_token);
    return tokens;
  }

  /**
   * Create Tokens
   */
  async createTokens(user: User | UserDto): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.email,
          role: user.role,
        },
        {
          secret: 'test-at',
          expiresIn: 60 * 15,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.email,
          role: user.role,
        },
        {
          secret: 'test-rt',
          expiresIn: 60 * 60 * 24 * 7,
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  /**
   * Update Refresh Token hash
   */
  async updateRtHash(email: string, rt: string): Promise<boolean> {
    const hash = await bcrypt.hash(rt, 10);
    const result = await this.usersService.updateOne(
      { email },
      {
        $set: {
          hash,
        },
      },
    );

    return result.upsertedCount > 0;
  }
}
