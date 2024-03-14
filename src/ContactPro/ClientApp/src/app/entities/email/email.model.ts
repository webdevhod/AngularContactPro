import { IContact } from '../contact/contact.model';

export interface IEmail {
  subject: string;
  message: string;
  contacts: IContact[];
  isCategory: boolean;
}
