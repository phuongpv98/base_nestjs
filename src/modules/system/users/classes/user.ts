import { Exclude } from 'class-transformer';

export class User {
  _doc: any;
  _id?: string;

  name: string;
  email: string;

  @Exclude()
  password?: string;

  @Exclude()
  roles: string[];
}
