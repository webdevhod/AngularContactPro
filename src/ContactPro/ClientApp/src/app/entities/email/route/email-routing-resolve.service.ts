import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { IContact, Contact } from 'app/entities/contact/contact.model';
import { ContactService } from 'app/entities/contact/service/contact.service';

@Injectable({ providedIn: 'root' })
export class EmailRoutingResolveService implements Resolve<IContact | ICategory> {
  constructor(protected contactService: ContactService, protected categoryService: CategoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IContact> | Observable<ICategory> | Observable<never> {
    const path: string = route.params['path'];
    const id = Number(route.params['id']);

    if (id) {
      if (path === 'contact') {
        return this.contactService.find(id).pipe(
          mergeMap((contact: HttpResponse<Contact>) => {
            if (contact.body) {
              return of(contact.body);
            } else {
              this.router.navigate(['404']);
              return EMPTY;
            }
          })
        );
      } else if (path === 'category') {
        return this.categoryService.find(id).pipe(
          mergeMap((category: HttpResponse<ICategory>) => {
            if (category.body) {
              return of(category.body);
            } else {
              this.router.navigate(['404']);
              return EMPTY;
            }
          })
        );
      }
    }
    return EMPTY;
  }
}
