import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'notEqualTo', async: false })
export class NotEqualToConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    const [relatedProperty] = args.constraints;
    const relatedValue = (args.object as Record<string, unknown>)[relatedProperty];
    return value !== relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedProperty] = args.constraints;
    return `${args.property} must not be equal to ${relatedProperty}`;
  }
}

export function NotEqualTo(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NotEqualToConstraint,
    });
  };
}
