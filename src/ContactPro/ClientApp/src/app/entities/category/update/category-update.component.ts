import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, UrlSegment } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import { ICategory, Category } from "../category.model";
import { CategoryService } from "../service/category.service";
import { IContact } from "app/entities/contact/contact.model";
import { ContactService } from "app/entities/contact/service/contact.service";
import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";

@Component({
    selector: "jhi-category-update",
    templateUrl: "./category-update.component.html",
    styleUrls: ["./category-update.component.scss"],
})
export class CategoryUpdateComponent implements OnInit {
    isSaving = false;
    isNew = true;

    contactsSharedCollection: IContact[] = [];
    usersSharedCollection: IUser[] = [];

    editForm = this.fb.group({
        id: [],
        name: [null, [Validators.required]],
        created: [],
        contacts: [],
        user: [],
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

            this.loadRelationshipsOptions();
        });

        this.activatedRoute.url.subscribe((param: UrlSegment[]) => {
            this.isNew = param.some((p) => p.path === "new");
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

    getSelectedContact(option: IContact, selectedVals?: IContact[]): IContact {
        if (selectedVals) {
            for (const selectedVal of selectedVals) {
                if (option.id === selectedVal.id) {
                    return selectedVal;
                }
            }
        }
        return option;
    }

    protected subscribeToSaveResponse(
        result: Observable<HttpResponse<ICategory>>
    ): void {
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
            contacts: category.contacts,
            user: category.user,
        });

        this.contactsSharedCollection =
            this.contactService.addContactToCollectionIfMissing(
                this.contactsSharedCollection,
                ...(category.contacts ?? [])
            );
        this.usersSharedCollection =
            this.userService.addUserToCollectionIfMissing(
                this.usersSharedCollection,
                category.user
            );
    }

    protected loadRelationshipsOptions(): void {
        this.contactService
            .query()
            .pipe(map((res: HttpResponse<IContact[]>) => res.body ?? []))
            .pipe(
                map((contacts: IContact[]) =>
                    this.contactService.addContactToCollectionIfMissing(
                        contacts,
                        ...(this.editForm.get("contacts")!.value ?? [])
                    )
                )
            )
            .subscribe(
                (contacts: IContact[]) =>
                    (this.contactsSharedCollection = contacts)
            );

        this.userService
            .query()
            .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
            .pipe(
                map((users: IUser[]) =>
                    this.userService.addUserToCollectionIfMissing(
                        users,
                        this.editForm.get("user")!.value
                    )
                )
            )
            .subscribe(
                (users: IUser[]) => (this.usersSharedCollection = users)
            );
    }

    protected createFromForm(): ICategory {
        return {
            ...new Category(),
            id: this.editForm.get(["id"])!.value,
            name: this.editForm.get(["name"])!.value,
            created: this.editForm.get(["created"])!.value,
            contacts: this.editForm.get(["contacts"])!.value,
            user: this.editForm.get(["user"])!.value,
        };
    }
}
