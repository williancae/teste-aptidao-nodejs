import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'farmAreaValidation', async: false })
export class FarmAreaValidation implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const object = args.object as any;
        const { totalArea, agriculturableArea, vegetationArea } = object;

        if (!totalArea || !agriculturableArea || !vegetationArea) {
            return true;
        }

        return agriculturableArea + vegetationArea <= totalArea;
    }

    defaultMessage(args: ValidationArguments) {
        const object = args.object as any;
        const { totalArea, agriculturableArea, vegetationArea } = object;
        return `A soma das áreas (${agriculturableArea + vegetationArea}ha) não pode exceder a área total (${totalArea}ha)`;
    }
}
