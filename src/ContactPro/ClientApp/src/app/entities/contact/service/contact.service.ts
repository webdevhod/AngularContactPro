import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import dayjs from "dayjs/esm";

import { isPresent } from "app/core/util/operators";
import { DATE_FORMAT } from "app/config/input.constants";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { IContact, getContactIdentifier } from "../contact.model";

export type EntityResponseType = HttpResponse<IContact>;
export type EntityArrayResponseType = HttpResponse<IContact[]>;

@Injectable({ providedIn: "root" })
export class ContactService {
  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("api/contacts");

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService
  ) {}

  create(contact: IContact): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contact);
    return this.http
      .post<IContact>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(contact: IContact): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contact);
    return this.http
      .put<IContact>(
        `${this.resourceUrl}/${getContactIdentifier(contact) as number}`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(contact: IContact): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(contact);
    return this.http
      .patch<IContact>(
        `${this.resourceUrl}/${getContactIdentifier(contact) as number}`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IContact>(`${this.resourceUrl}/${id}`, { observe: "response" })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IContact[]>(this.resourceUrl, {
        params: options,
        observe: "response",
      })
      .pipe(
        map((res: EntityArrayResponseType) =>
          this.convertDateArrayFromServer(res)
        )
      );
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  addContactToCollectionIfMissing(
    contactCollection: IContact[],
    ...contactsToCheck: (IContact | null | undefined)[]
  ): IContact[] {
    const contacts: IContact[] = contactsToCheck.filter(isPresent);
    if (contacts.length > 0) {
      const contactCollectionIdentifiers = contactCollection.map(
        (contactItem) => getContactIdentifier(contactItem)!
      );
      const contactsToAdd = contacts.filter((contactItem) => {
        const contactIdentifier = getContactIdentifier(contactItem);
        if (
          contactIdentifier == null ||
          contactCollectionIdentifiers.includes(contactIdentifier)
        ) {
          return false;
        }
        contactCollectionIdentifiers.push(contactIdentifier);
        return true;
      });
      return [...contactsToAdd, ...contactCollection];
    }
    return contactCollection;
  }

  protected convertDateFromClient(contact: IContact): IContact {
    return Object.assign({}, contact, {
      birthDate: contact.birthDate?.isValid()
        ? contact.birthDate.format(DATE_FORMAT)
        : undefined,
      created: contact.created?.isValid()
        ? contact.created.format(DATE_FORMAT)
        : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.birthDate = res.body.birthDate
        ? dayjs(res.body.birthDate)
        : undefined;
      res.body.created = res.body.created ? dayjs(res.body.created) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(
    res: EntityArrayResponseType
  ): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((contact: IContact) => {
        contact.birthDate = contact.birthDate
          ? dayjs(contact.birthDate)
          : undefined;
        contact.created = contact.created ? dayjs(contact.created) : undefined;
      });
    }
    return res;
  }
}
