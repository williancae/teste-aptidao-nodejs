import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { validateCpfCnpj } from '../../shared/utils/validation.utils';

@ValidatorConstraint({ name: 'cpfCnpjValidation', async: false })
export class CpfCnpjValidation implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return validateCpfCnpj(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Invalid CPF or CNPJ format';
  }
}
