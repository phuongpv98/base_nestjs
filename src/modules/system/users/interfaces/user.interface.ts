import { Document } from 'mongoose';

export interface IUser extends Document {
  _doc: any;
  name: string;
  email: string;
  password?: string;
  roles: string[];
}
