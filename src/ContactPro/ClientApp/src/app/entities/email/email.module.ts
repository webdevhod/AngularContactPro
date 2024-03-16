import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { EmailComponent } from './list/email.component';
import { SharedModule } from 'app/shared/shared.module';
import { EmailRoutingModule } from './route/email-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [SharedModule, FormsModule, EmailRoutingModule, MultiSelectModule],
  declarations: [EmailComponent],
  exports: [EmailComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmailModule {}
