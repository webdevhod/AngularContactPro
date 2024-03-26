import { Component, HostListener, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContact } from '../contact.model';
import { ContactService } from '../service/contact.service';
import { ContactDeleteDialogComponent } from '../delete/contact-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { CategoryService } from 'app/entities/category/service/category.service';
import { ICategory } from 'app/entities/category/category.model';

@Component({
  selector: 'jhi-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contacts?: IContact[];
  isLoading = false;

  allCategories: ICategory[] = [];
  selectedCategory: ICategory | null = null;

  searchTerm = '';

  constructor(
    protected contactService: ContactService,
    protected categoryService: CategoryService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.handleSearch();
    } else if (event.code === 'Escape') {
      this.searchTerm = '';
      this.handleSearch();
    }
  }

  loadAll(): void {
    this.isLoading = true;
    this.selectedCategory = null;

    this.contactService.query().subscribe({
      next: (res: HttpResponse<IContact[]>) => {
        this.isLoading = false;
        this.contacts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });

    this.categoryService.query().subscribe({
      next: (res: HttpResponse<ICategory[]>) => {
        this.allCategories = res.body?.map(category => this.categoryService.convertDateFromClient(category)) ?? [];
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IContact): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(contact: IContact): void {
    const modalRef = this.modalService.open(ContactDeleteDialogComponent, {
      size: 'lg',
      backdrop: 'static',
    });
    modalRef.componentInstance.contact = contact;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }

  handleDropdownChange(): void {
    if (this.selectedCategory?.id) {
      this.categoryService.find(this.selectedCategory.id).subscribe((res: HttpResponse<ICategory>) => {
        this.contacts = res.body?.contacts ?? [];
        this.searchTerm = '';
      });
    } else {
      this.loadAll();
    }
  }

  handleSearch(): void {
    if (this.searchTerm.length > 0) {
      this.contactService
        .query({
          searchTerm: this.searchTerm,
        })
        .subscribe({
          next: (res: HttpResponse<IContact[]>) => {
            this.isLoading = false;
            this.selectedCategory = null;
            this.contacts = res.body ?? [];
          },
          error: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.loadAll();
    }
  }

  getImageSrc(contact: IContact): string {
    return this.contactService.getImageSrc(contact);
  }
}
