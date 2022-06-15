import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const getHeaders = (req: Request) => {
  const authHeader = req.headers.authorization;
  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !token) {
    throw new UnauthorizedException();
  }
  return token;
};
