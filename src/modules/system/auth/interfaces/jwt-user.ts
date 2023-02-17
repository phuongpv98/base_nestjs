import { ObjectId } from 'mongoose';

export interface IUserJWT {
  _id: ObjectId;
  email: string;
  roles: [string];
}
