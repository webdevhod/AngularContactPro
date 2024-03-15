import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../contact/service/contact.service';
import { CategoryService } from '../../category/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IContact } from '../../contact/contact.model';
import { HttpResponse } from '@angular/common/http';
import { ICategory } from '../../category/category.model';
import { IEmail } from '../email.model';
import { EmailService } from '../service/email.service';

@Component({
  selector: 'jhi-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {
  allContacts: IContact[] = [];
  selectedContacts: number[] = [];
  isCategory = false;
  categoryName = '';

  subject = '';
  message = '';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected contactService: ContactService,
    protected categoryService: CategoryService,
    protected emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.contactService.query().subscribe({
      next: (res: HttpResponse<IContact[]>) => {
        this.allContacts = res.body ?? [];
      },
    });

    this.activatedRoute.data.subscribe(({ contactOrCategory }) => {
      if (this.isObjectCategory(contactOrCategory)) {
        this.isCategory = true;
        this.categoryName = contactOrCategory.name;
        contactOrCategory.contacts?.forEach((contact: IContact) => {
          contact.id !== undefined && this.selectedContacts.push(contact.id);
        });
      } else if (this.isObjectContact(contactOrCategory)) {
        this.isCategory = false;
        this.categoryName = 'Contact';
        this.selectedContacts.push(contactOrCategory.id);
      }
    });
  }

  isObjectContact(contactOrCategory: IContact | ICategory): boolean {
    return (
      'email' in contactOrCategory ||
      'firstName' in contactOrCategory ||
      'lastName' in contactOrCategory ||
      'phoneNumber' in contactOrCategory ||
      'birthDate' in contactOrCategory ||
      'categories' in contactOrCategory ||
      'imageData' in contactOrCategory ||
      'tag' in contactOrCategory ||
      'fullName' in contactOrCategory
    );
  }

  isObjectCategory(contactOrCategory: IContact | ICategory): boolean {
    return 'contacts' in contactOrCategory || 'name' in contactOrCategory;
  }

  isValidEmail(): boolean {
    return this.selectedContacts.length > 0 && this.subject.length > 0 && this.message.length > 0;
  }

  handleCancel(): void {
    const path: string = this.router.url.split('/')[1];
    this.router.navigate([`/${path}`]);
  }

  send(): void {
    const email = this.createFromForm();
    // eslint-disable-next-line no-console
    console.log('send', email);
    this.emailService.create(email).subscribe(res => {
      // eslint-disable-next-line no-console
      console.log(res);
    })
  }

  protected createFromForm(): IEmail {
    const selectedContacts: Set<number> = new Set<number>(this.selectedContacts);
    return {
      contacts: this.allContacts.filter(contact => selectedContacts.has(contact.id!)),
      subject: this.subject,
      message: this.message,
      isCategory: this.isCategory,
    };
  }
}
