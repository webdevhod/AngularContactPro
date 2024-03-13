import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CategoryComponent } from './list/category.component';
import { CategoryUpdateComponent } from './update/category-update.component';
import { CategoryDeleteDialogComponent } from './delete/category-delete-dialog.component';
import { CategoryRoutingModule } from './route/category-routing.module';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  imports: [SharedModule, CategoryRoutingModule, MultiSelectModule],
  declarations: [CategoryComponent, CategoryUpdateComponent, CategoryDeleteDialogComponent],
  entryComponents: [CategoryDeleteDialogComponent],
})
export class CategoryModule {}
