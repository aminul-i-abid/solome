import { BadRequestException } from '@nestjs/common';

/**
 * Validates that the provided object has at least one property with a non-null and non-undefined value.
 * If no such property is found, it throws a `BadRequestException` with the provided message.
 *
 * @param body - The object to be validated.
 * @param message - The error message to be used if validation fails. Defaults to 'At least one property must be provided for update'.
 * @returns `true` if the validation passes.
 * @throws `BadRequestException` if the validation fails.
 */
export function hasValidPropertyValidator(
  body: Record<string, any>,
  message = 'At least one property must be provided for update',
) {
  const hasValidProperty = Object.values(body).some(
    (value) => value !== undefined && value !== null,
  );
  if (!hasValidProperty) {
    throw new BadRequestException(message);
  }

  return true;
}
