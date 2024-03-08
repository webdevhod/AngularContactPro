import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IContact, Contact } from '../contact.model';
import { ContactService } from '../service/contact.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { States } from 'app/entities/enumerations/states.model';
import { ICategory } from 'app/entities/category/category.model';
import { CategoryService } from 'app/entities/category/service/category.service';
// import { ThemeService } from "app/theme.service";

@Component({
  selector: 'jhi-contact-update',
  templateUrl: './contact-update.component.html',
  styleUrls: ['./contact-update.component.scss'],
})
export class ContactUpdateComponent implements OnInit {
  isNew = false;
  isSaving = false;
  statesKeys = Object.keys(States);
  blurredInputs: { [key: string]: boolean } = {};

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    address1: [null, [Validators.required]],
    address2: [],
    city: [null, [Validators.required]],
    state: [null, [Validators.required]],
    zipCode: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    phoneNumber: [
      null,
      [
        Validators.required,
        // Validators.pattern("^[0-9]{3}-[0-9]{3}-[0-9]{4}$"),
      ],
    ],
    birthDate: [],
    created: [],
    imageData: [],
    imageDataContentType: [],
    imageType: [],
    user: [],
    categories: [],
    userId: [],
  });

  allCategories: ICategory[] = [];
  selectedCategories: number[] = [];

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected contactService: ContactService,
    protected categoryService: CategoryService,
    protected userService: UserService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder // private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((param: UrlSegment[]) => {
      this.isNew = param.some(p => p.path === 'new');
    });

    this.activatedRoute.data.subscribe(({ contact }) => {
      this.selectedCategories = contact.categories?.map((category: ICategory) => category.id) ?? [];
      this.updateForm(contact);
    });

    this.categoryService.query().subscribe({
      next: (res: HttpResponse<ICategory[]>) => {
        this.allCategories = res.body?.map(category => this.categoryService.convertDateFromClient(category)) ?? [];
      },
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('contactProApp.error', {
            message: err.message,
          })
        ),
    });
  }

  setFileType(event: Event, field: string, isImage: boolean): void {
    const eventTarget: HTMLInputElement | null = event.target as HTMLInputElement | null;
    if (eventTarget?.files?.[0]) {
      const file: File = eventTarget.files[0];
      if (isImage && file.type.startsWith('image/')) {
        this.editForm.patchValue({
          imageType: file.type,
        });
      }
    }
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contact = this.createFromForm();
    if (!this.isNew && contact.id !== undefined) {
      this.subscribeToSaveResponse(this.contactService.update(contact));
    } else {
      this.subscribeToSaveResponse(this.contactService.create(contact));
    }
  }

  trackUserById(_index: number, item: IUser): string {
    return item.id!;
  }

  handleBlur(field: string): void {
    this.blurredInputs[field] = true;
  }

  handleFocus(field: string): void {
    this.blurredInputs[field] = false;
  }

  isBlurred(field: string): boolean {
    if (this.blurredInputs[field]) {
      return true;
    } else {
      return false;
    }
  }

  getStateValue(key: string): string {
    return States[key as keyof typeof States];
  }

  getSelectedCategories(): ICategory[] {
    const selectedCategories: Set<number | undefined> = new Set(this.selectedCategories);
    selectedCategories.delete(undefined);
    return this.allCategories.filter(category => category.id && selectedCategories.has(category.id));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContact>>): void {
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

  protected updateForm(contact: IContact): void {
    this.editForm.patchValue({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      address1: contact.address1,
      address2: contact.address2,
      city: contact.city,
      state: contact.state,
      zipCode: contact.zipCode,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      birthDate: contact.birthDate,
      created: contact.created,
      imageData: contact.imageData,
      imageDataContentType: contact.imageDataContentType,
      imageType: contact.imageType,
      categories: this.getSelectedCategories(),
    });
  }

  protected createFromForm(): IContact {
    return {
      ...new Contact(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      address1: this.editForm.get(['address1'])!.value,
      address2: this.editForm.get(['address2'])!.value,
      city: this.editForm.get(['city'])!.value,
      state: this.editForm.get(['state'])!.value,
      zipCode: this.editForm.get(['zipCode'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      birthDate: this.editForm.get(['birthDate'])!.value,
      created: this.editForm.get(['created'])!.value,
      imageDataContentType: this.editForm.get(['imageDataContentType'])!.value,
      imageData: this.editForm.get(['imageData'])!.value,
      imageType: this.editForm.get(['imageType'])!.value,
      categories: this.getSelectedCategories(),
    };
  }
}
