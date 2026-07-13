import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') {
            return false;
          }

          const datePart = value.split('T')[0];
          const [year, month, day] = datePart.split('-').map(Number);

          if (!year || !month || !day) {
            return false;
          }

          const inputDate = new Date(year, month - 1, day);
          inputDate.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return inputDate >= today;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} cannot be in the past`;
        },
      },
    });
  };
}