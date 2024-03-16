import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { IEmail } from '../email.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/emails');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(email: IEmail): Observable<EntityResponseType> {
    return this.http.post<IEmail>(this.resourceUrl, email, { observe: 'response' }).pipe(map((data: EntityResponseType) => data));
  }
}

export type EntityResponseType = HttpResponse<IEmail>;
