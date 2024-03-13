import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmailComponent } from '../list/email.component';
import { EmailRoutingResolveService } from './email-routing-resolve.service';

const emailRoute: Routes = [
  {
    path: '',
    component: EmailComponent,
    resolve: {
      contactOrCategory: EmailRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emailRoute)],
  exports: [RouterModule],
})
export class EmailRoutingModule {}
