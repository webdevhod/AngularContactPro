import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
// import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { EmailComponent } from './list/email.component';
import { SharedModule } from 'primeng/api';
import { EmailRoutingModule } from './route/email-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, SharedModule, FormsModule, EmailRoutingModule, MultiSelectModule],
  declarations: [EmailComponent],
  exports: [EmailComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmailModule {}
