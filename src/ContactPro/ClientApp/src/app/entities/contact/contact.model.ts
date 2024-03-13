import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { ICategory } from 'app/entities/category/category.model';
import { States } from 'app/entities/enumerations/states.model';

export interface IContact {
  id?: number;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string | null;
  city?: string;
  state?: States;
  zipCode?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: dayjs.Dayjs | null;
  created?: dayjs.Dayjs | null;
  imageDataContentType?: string | null;
  imageData?: string | null;
  imageType?: string | null;
  user?: IUser | null;
  userId?: string | null;
  categories?: ICategory[] | null;
  tag?: string;
  fullName?: string;
}

export class Contact implements IContact {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public address1?: string,
    public address2?: string | null,
    public city?: string,
    public state?: States,
    public zipCode?: string,
    public email?: string,
    public phoneNumber?: string,
    public birthDate?: dayjs.Dayjs | null,
    public created?: dayjs.Dayjs | null,
    public imageDataContentType?: string | null,
    public imageData?: string | null,
    public imageType?: string | null,
    public user?: IUser | null,
    public userId?: string | null,
    public categories?: ICategory[] | null
  ) {}
}

export function getContactIdentifier(contact: IContact): number | undefined {
  return contact.id;
}
