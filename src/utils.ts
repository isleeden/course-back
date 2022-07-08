import { getPaginationData } from 'src/types/get-data.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
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
  options: { query: getPaginationData },
) {
  const { query } = options;
  const where = JSON.parse(query.where);
  const findQuery = model
    .find(where)
    .skip(query.offset)
    .sort(JSON.parse(query.sort))
    .limit(query.limit);
  const count = await model.where(where).count();
  return { findQuery, count };
}

export async function aggregateByLength<T>(
  model: Model<T>,
  options: {
    query: getPaginationData;
    lengthField: string;
  },
) {
  const { query } = options;
  const where = JSON.parse(query.where);
  const results = model
    .aggregate()
    .match(where)
    .addFields({ length: { $size: options.lengthField } })
    .sort(JSON.parse(query.sort))
    .skip(Number(query.offset))
    .limit(Number(query.limit));
  const count = await model.where(where).count();
  return { results, count };
}
