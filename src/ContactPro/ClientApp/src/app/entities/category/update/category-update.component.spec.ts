import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { CategoryService } from "../service/category.service";
import { ICategory, Category } from "../category.model";
import { IContact } from "app/entities/contact/contact.model";
import { ContactService } from "app/entities/contact/service/contact.service";

import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";

import { CategoryUpdateComponent } from "./category-update.component";

describe("Category Management Update Component", () => {
  let comp: CategoryUpdateComponent;
  let fixture: ComponentFixture<CategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let categoryService: CategoryService;
  let contactService: ContactService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CategoryUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CategoryUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(CategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    categoryService = TestBed.inject(CategoryService);
    contactService = TestBed.inject(ContactService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call Contact query and add missing value", () => {
      const category: ICategory = { id: 456 };
      const contacts: IContact[] = [{ id: 17067 }];
      category.contacts = contacts;

      const contactCollection: IContact[] = [{ id: 29257 }];
      jest
        .spyOn(contactService, "query")
        .mockReturnValue(of(new HttpResponse({ body: contactCollection })));
      const additionalContacts = [...contacts];
      const expectedCollection: IContact[] = [
        ...additionalContacts,
        ...contactCollection,
      ];
      jest
        .spyOn(contactService, "addContactToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ category });
      comp.ngOnInit();

      expect(contactService.query).toHaveBeenCalled();
      expect(
        contactService.addContactToCollectionIfMissing
      ).toHaveBeenCalledWith(contactCollection, ...additionalContacts);
      expect(comp.contactsSharedCollection).toEqual(expectedCollection);
    });

    it("Should call User query and add missing value", () => {
      const category: ICategory = { id: 456 };
      const user: IUser = { id: "c7b5352d-dbcf-4204-a223-8cccadc9bdf6" };
      category.user = user;

      const userCollection: IUser[] = [
        { id: "5ac3fee7-728b-49ca-8959-371053a29ffb" },
      ];
      jest
        .spyOn(userService, "query")
        .mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [
        ...additionalUsers,
        ...userCollection,
      ];
      jest
        .spyOn(userService, "addUserToCollectionIfMissing")
        .mockReturnValue(expectedCollection);

      activatedRoute.data = of({ category });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it("Should update editForm", () => {
      const category: ICategory = { id: 456 };
      const contacts: IContact = { id: 70151 };
      category.contacts = [contacts];
      const user: IUser = { id: "496b890f-01b5-428a-9c40-d1a7e3e3fd8c" };
      category.user = user;

      activatedRoute.data = of({ category });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(category));
      expect(comp.contactsSharedCollection).toContain(contacts);
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Category>>();
      const category = { id: 123 };
      jest.spyOn(categoryService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ category });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: category }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(categoryService.update).toHaveBeenCalledWith(category);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Category>>();
      const category = new Category();
      jest.spyOn(categoryService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ category });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: category }));
      saveSubject.complete();

      // THEN
      expect(categoryService.create).toHaveBeenCalledWith(category);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Category>>();
      const category = { id: 123 };
      jest.spyOn(categoryService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ category });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(categoryService.update).toHaveBeenCalledWith(category);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe("Tracking relationships identifiers", () => {
    describe("trackContactById", () => {
      it("Should return tracked Contact primary key", () => {
        const entity = { id: 123 };
        const trackResult = comp.trackContactById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe("trackUserById", () => {
      it("Should return tracked User primary key", () => {
        const entity = { id: "ABC" };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe("Getting selected relationships", () => {
    describe("getSelectedContact", () => {
      it("Should return option if no Contact is selected", () => {
        const option = { id: 123 };
        const result = comp.getSelectedContact(option);
        expect(result === option).toEqual(true);
      });

      it("Should return selected Contact for according option", () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedContact(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it("Should return option if this Contact is not selected", () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedContact(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
