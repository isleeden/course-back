import { getPaginationData } from 'src/types/get-data.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Model } from 'mongoose';

export const getHeaders = (req: Request) => {
  const authHeader = req.headers.authorization;
  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !token) {
    throw new UnauthorizedException();
  }
  return token;
};

export async function paginationQuery<T>(
  model: Model<T>,
  options: { where: any; query: getPaginationData },
) {
  const { where, query } = options;
  const findQuery = model
    .find(where)
    .skip(query.offset)
    .sort(query.sort)
    .limit(query.limit);
  const count = await model.where(where).count();
  return { findQuery, count };
}
