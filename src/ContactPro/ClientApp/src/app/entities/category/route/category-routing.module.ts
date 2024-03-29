import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CategoryComponent } from '../list/category.component';
import { CategoryUpdateComponent } from '../update/category-update.component';
import { CategoryRoutingResolveService } from './category-routing-resolve.service';

const categoryRoute: Routes = [
  {
    path: '',
    component: CategoryComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CategoryUpdateComponent,
    resolve: {
      category: CategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CategoryUpdateComponent,
    resolve: {
      category: CategoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(categoryRoute)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
