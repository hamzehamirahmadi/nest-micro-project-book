import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const ValidationPipeObject: (options: ValidationPipeOptions) => any 
= (options: ValidationPipeOptions = { }): any => {
  return {
    exceptionFactory: (errors: ValidationError) => new BadRequestException(errors),
    forbidNonWhitelisted: true,
    transform: true,
    whitelist: true,
    ...options,
  };
};
