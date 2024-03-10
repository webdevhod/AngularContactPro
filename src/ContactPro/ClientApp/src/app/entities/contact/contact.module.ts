import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ContactComponent } from './list/contact.component';
import { ContactDetailComponent } from './detail/contact-detail.component';
import { ContactUpdateComponent } from './update/contact-update.component';
import { ContactDeleteDialogComponent } from './delete/contact-delete-dialog.component';
import { ContactRoutingModule } from './route/contact-routing.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  imports: [SharedModule, ContactRoutingModule, DropdownModule, MultiSelectModule],
  declarations: [ContactComponent, ContactDetailComponent, ContactUpdateComponent, ContactDeleteDialogComponent],
  entryComponents: [ContactDeleteDialogComponent],
})
export class ContactModule {}
