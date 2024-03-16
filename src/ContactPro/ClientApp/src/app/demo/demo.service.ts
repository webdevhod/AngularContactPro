import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider, JwtToken } from 'app/core/auth/auth-jwt.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/demo');

  constructor(
    protected http: HttpClient,
    private accountService: AccountService,
    private authServerProvider: AuthServerProvider,
    protected applicationConfigService: ApplicationConfigService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService
  ) {}

  createDemoAccount(): void {
    if (this.accountService.isAuthenticated()) {
      this.authServerProvider.logout().subscribe(() => {
        this.createJwtToken();
      });
    } else {
      this.createJwtToken();
    }
  }

  createJwtToken(): void {
    this.http.get<JwtToken>(this.resourceUrl, { observe: 'response' }).subscribe((res: HttpResponse<JwtToken>) => {
      if (res.body) {
        this.authenticateSuccess(res.body, false);
        this.accountService.identity(true).subscribe(account => {
          // eslint-disable-next-line no-console
          console.log(account);
        });
      }
    });
  }

  protected authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    if (rememberMe) {
      this.localStorageService.store('authenticationToken', jwt);
      this.sessionStorageService.clear('authenticationToken');
    } else {
      this.sessionStorageService.store('authenticationToken', jwt);
      this.localStorageService.clear('authenticationToken');
    }
  }
}
