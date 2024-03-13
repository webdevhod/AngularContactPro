import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../contact/service/contact.service';
import { CategoryService } from '../../category/service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IContact } from '../../contact/contact.model';
import { HttpResponse } from '@angular/common/http';
import { ICategory } from '../../category/category.model';

@Component({
  selector: 'jhi-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {
  allContacts: IContact[] = [];
  selectedContacts: number[] = [];
  isContact = false;
  categoryName = '';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected contactService: ContactService,
    protected categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.contactService.query().subscribe({
      next: (res: HttpResponse<IContact[]>) => {
        this.allContacts = res.body ?? [];
      },
    });

    this.activatedRoute.data.subscribe(({ contactOrCategory }) => {
      if (this.isObjectContact(contactOrCategory)) {
        this.isContact = true;
        this.categoryName = 'Contact';
        this.selectedContacts.push(contactOrCategory.id);
      } else if (this.isObjectCategory(contactOrCategory)) {
        this.isContact = false;
        this.categoryName = contactOrCategory.name;
        contactOrCategory.contacts?.forEach((contact: IContact) => {
          contact.id !== undefined && this.selectedContacts.push(contact.id);
        });
      }
    });
  }

  isObjectContact(contactOrCategory: IContact | ICategory): boolean {
    return (
      'firstName' in contactOrCategory ||
      'lastName' in contactOrCategory ||
      'email' in contactOrCategory ||
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
}
