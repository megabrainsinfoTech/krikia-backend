import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';

export class LoginAuthDTO {
  @IsNotEmpty({ message: 'Please provide your email address' })
  @IsEmail({ message: 'Provide a valid email address' })
  email: string;

  @IsNotEmpty({ message: 'Please provide your password' })
  @MinLength(8, { message: 'Password cannot be less than 8 character' })
  password: string;
}

export class VerifyEmailToken {
  @IsNotEmpty({ message: 'Please provide your One Time Password' })
  @MinLength(6, { message: 'Otp must not be less than 6 digits number' })
  @IsString({ message: 'Provide your otp token' })
  token: string;

  @IsNotEmpty({ message: 'Provide the required user_token_id' })
  @IsString({ message: 'User token id is a string' })
  user_token_id: string;
}
