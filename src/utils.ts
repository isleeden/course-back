import FieldTypes from './types/field-types';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import moment from 'moment';

export const getHeaders = (req: Request) => {
  const authHeader = req.headers.authorization;
  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !token) {
    throw new UnauthorizedException();
  }
  return token;
};

export const validateField = (type: FieldTypes, value: any) => {
  switch (type) {
    case FieldTypes.Text:
      if (typeof value === 'string') return;
      else throw new BadRequestException();
    case FieldTypes.Number:
      if (!isNaN(value)) return;
      else throw new BadRequestException();
    case FieldTypes.Bigtext:
      if (typeof value === 'string') return;
      else throw new BadRequestException();
    case FieldTypes.Boolean:
      if (typeof value === 'boolean') return;
      else throw new BadRequestException();
    case FieldTypes.Date:
      if (moment(value).isValid()) return;
      else throw new BadRequestException();
    default:
      break;
  }
};
