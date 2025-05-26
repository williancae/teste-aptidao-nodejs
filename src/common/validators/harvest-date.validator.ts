import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'harvestDateValidation', async: false })
export class HarvestDateValidation implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const object = args.object as any;
        const { startDate, endDate } = object;

        if (!startDate || !endDate) return true;

        const start = new Date(startDate);
        const end = new Date(endDate);

        return start < end;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Start date must be before end date';
    }
}
