// import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

// @ValidatorConstraint({ name: 'MinimumAge' })
// export class MinimumAgeConstraint implements ValidatorConstraintInterface {
//   validate(value: Date, validationArguments: ValidationArguments) {
//     if (!value) {
//       return false; // Invalid if no value provided
//     }

//     const eighteenYearsAgo = new Date();
//     eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

//     return value < eighteenYearsAgo; // Valid if date is before 18 years ago
//   }
// }

// @ValidatorConstraint({ name: 'MinimumAge' })
// export function MinimumAge() {
//   return function (object: Object, propertyName: string) {
//     return Reflect.metadata('validate', new MinimumAgeConstraint(), object, propertyName);
//   };
// }
