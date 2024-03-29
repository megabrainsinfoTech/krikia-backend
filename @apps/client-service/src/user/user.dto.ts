import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsEnum,
  IsDate,
  IsString,
  IsNumber,
  IsPhoneNumber,
  isString,
  Validate,
} from 'class-validator';

export class WithEmail {
  @IsNotEmpty({ message: 'Email must be provided' })
  @IsEmail()
  email: string;
}
export class CreateNewUserPassword {
  @IsNotEmpty({ message: 'Token Id cannot be blank' })
  @IsString()
  token: string;
  @IsNotEmpty({ message: 'Password cannot be blank' })
  @MinLength(8, { message: 'Password cannot be less than 8 character' })
  password: string;

  @IsNotEmpty({ message: 'Confirm Password cannot be blank' })
  @MinLength(8, { message: 'Confirm Password cannot be less than 8 character' })
  confirmPassword: string;
}
export class CreateUserDTO extends CreateNewUserPassword {
  @IsNotEmpty({ message: 'Email must be provided' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'First name cannot be blank' })
  @IsString()
  firstName?: string;

  @IsNotEmpty({ message: 'Last name cannot be blank' })
  @IsString()
  lastName?: string;

  @IsNotEmpty({ message: 'Please provide your phone number' })
  @IsPhoneNumber('NG', {
    message: 'Please provide a Valid Nigeria Phone Number',
  })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Provide your gender' })
  @IsEnum(
    { Male: 'male', Female: 'male' },
    { message: 'Select Male or female' },
  )
  gender: string;
}

export class createEmailDTO {
  @IsNotEmpty({ message: 'Please provide your email address' })
  @IsEmail({ message: 'Invalid email Address' })
  email: string;
}

export class PayForListingDTO {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum({ Weekly: 'Weekly', Monthly: 'Monthly' })
  paymentFrequency: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  listingPlanOptionId: string;

  @IsString()
  fnxReceiverAddress: string;

  @IsOptional()
  @IsString()
  purchaseId?: string;
}

export class CompleteUserProfileDTO {
  @IsNotEmpty({
    message: 'First Name cannot be blank',
  })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Email cannot be blank' })
  @IsString()
  @IsEmail(undefined, { message: 'Please provide a valid email address' })
  email: string;

  @IsNotEmpty({
    message: 'Last Name cannot be blank',
  })
  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'Select your Gender' })
  @IsEnum({ Male: 'Male', Female: 'Female' })
  gender: string;

  @IsPhoneNumber('NG', {
    message(validationArguments) {
      return validationArguments.value + ' is a not a Valid Phone Number';
    },
  })
  phone: string;

  @IsNotEmpty({ message: 'Please provide your Date of Birth' })
  @Validate(
    (obj: any, value: any) => {
      // Ensure value is a valid Date object
      return value instanceof Date && !isNaN(value.getTime());
    },
    {
      message: 'Select a valid date of birth',
    },
  )
  dateOfBirth: Date;
}

export class UpdateUserDTO extends CompleteUserProfileDTO {
  // const createUser = await this.userService.create({
  //   status: 'Active',
  //   avatarUrl: `${process.env.CDN_URL}/krikia-assets/default_avatar.png`,
  // });

  @IsOptional()
  @IsString()
  avatarUrl: string;

  @IsOptional()
  stateOfResidence: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address: string;
}
