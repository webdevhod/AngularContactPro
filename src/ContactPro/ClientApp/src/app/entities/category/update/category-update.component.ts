import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICategory, Category } from '../category.model';
import { CategoryService } from '../service/category.service';
import { IContact } from 'app/entities/contact/contact.model';
import { ContactService } from 'app/entities/contact/service/contact.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss'],
})
export class CategoryUpdateComponent implements OnInit {
  isSaving = false;
  isNew = true;

  contactsSharedCollection: IContact[] = [];
  allContacts: IContact[] = [];
  selectedContacts: number[] = [];
  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    created: [],
    contacts: [],
    user: [],
    userId: [],
  });

  constructor(
    protected categoryService: CategoryService,
    protected contactService: ContactService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ category }) => {
      this.updateForm(category);

      this.selectedContacts = category.contacts.map((contact: IContact) => contact.id);
    });

    this.activatedRoute.url.subscribe((param: UrlSegment[]) => {
      this.isNew = param.some(p => p.path === 'new');
    });

    this.contactService.query().subscribe({
      next: (res: HttpResponse<IContact[]>) => {
        this.allContacts = res.body ?? [];
      },
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const category = this.createFromForm();
    if (category.id !== undefined) {
      this.subscribeToSaveResponse(this.categoryService.update(category));
    } else {
      this.subscribeToSaveResponse(this.categoryService.create(category));
    }
  }

  trackContactById(_index: number, item: IContact): number {
    return item.id!;
  }

  trackUserById(_index: number, item: IUser): string {
    return item.id!;
  }

  getSelectedContacts(): IContact[] {
    const selectedContacts: Set<number | undefined> = new Set(this.selectedContacts);
    return this.allContacts.filter(contact => selectedContacts.has(contact.id));
  }

  getSelectedContact(id: number): IContact | undefined {
    return this.allContacts.find(contact => contact.id === id);
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(category: ICategory): void {
    this.editForm.patchValue({
      id: category.id,
      name: category.name,
      created: category.created,
      contacts: this.getSelectedContacts(),
      user: category.user,
      userId: category.userId,
    });
  }

  protected createFromForm(): ICategory {
    return {
      ...new Category(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      created: this.editForm.get(['created'])!.value,
      contacts: this.getSelectedContacts(),
      user: this.editForm.get(['user'])!.value,
      userId: this.editForm.get(['userId'])!.value,
    };
  }
}
