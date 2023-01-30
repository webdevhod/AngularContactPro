import dayjs from "dayjs/esm";
import { IContact } from "app/entities/contact/contact.model";
import { IUser } from "app/entities/user/user.model";

export interface ICategory {
  id?: number;
  name?: string;
  created?: dayjs.Dayjs | null;
  contacts?: IContact[] | null;
  user?: IUser | null;
}

export class Category implements ICategory {
  constructor(
    public id?: number,
    public name?: string,
    public created?: dayjs.Dayjs | null,
    public contacts?: IContact[] | null,
    public user?: IUser | null
  ) {}
}

export function getCategoryIdentifier(category: ICategory): number | undefined {
  return category.id;
}
