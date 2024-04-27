import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

function IsEnumCombination(
  enumObj: object,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isEnumCombination',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [enumObj],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const enumValues = Object.values(args.constraints[0]).filter(
            (value) => typeof value === 'string',
          ) as string[];

          const combinations: string[] = [];
          for (let i = 1; i <= enumValues.length; i++) {
            for (let j = 0; j <= enumValues.length - i; j++) {
              combinations.push(enumValues.slice(j, j + i).join(','));
            }
          }

          return combinations.includes(value);
        },
        defaultMessage(args: ValidationArguments) {
          const enumValues = Object.values(args.constraints[0]).filter(
            (value) => typeof value === 'string',
          ) as string[];

          const validCombinations = enumValues.join(', ');

          return `${args.property} must be a valid combination of enum values (${validCombinations})`;
        },
      },
    });
  };
}

export { IsEnumCombination };
