import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of, Subject, from } from "rxjs";

import { ContactService } from "../service/contact.service";
import { IContact, Contact } from "../contact.model";

import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";

import { ContactUpdateComponent } from "./contact-update.component";

describe("Contact Management Update Component", () => {
  let comp: ContactUpdateComponent;
  let fixture: ComponentFixture<ContactUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contactService: ContactService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ContactUpdateComponent],
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
      .overrideTemplate(ContactUpdateComponent, "")
      .compileComponents();

    fixture = TestBed.createComponent(ContactUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contactService = TestBed.inject(ContactService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe("ngOnInit", () => {
    it("Should call User query and add missing value", () => {
      const contact: IContact = { id: 456 };
      const user: IUser = { id: "36693166-215a-48a4-9a07-21d1251d560b" };
      contact.user = user;

      const userCollection: IUser[] = [
        { id: "59f810a9-710d-4caa-ae63-345bc781dccb" },
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

      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it("Should update editForm", () => {
      const contact: IContact = { id: 456 };
      const user: IUser = { id: "af384d48-163a-45b3-8c0a-663f09b01622" };
      contact.user = user;

      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(contact));
      expect(comp.usersSharedCollection).toContain(user);
    });
  });

  describe("save", () => {
    it("Should call update service on save for existing entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contact>>();
      const contact = { id: 123 };
      jest.spyOn(contactService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contact }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(contactService.update).toHaveBeenCalledWith(contact);
      expect(comp.isSaving).toEqual(false);
    });

    it("Should call create service on save for new entity", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contact>>();
      const contact = new Contact();
      jest.spyOn(contactService, "create").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contact }));
      saveSubject.complete();

      // THEN
      expect(contactService.create).toHaveBeenCalledWith(contact);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it("Should set isSaving to false on error", () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contact>>();
      const contact = { id: 123 };
      jest.spyOn(contactService, "update").mockReturnValue(saveSubject);
      jest.spyOn(comp, "previousState");
      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error("This is an error!");

      // THEN
      expect(contactService.update).toHaveBeenCalledWith(contact);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe("Tracking relationships identifiers", () => {
    describe("trackUserById", () => {
      it("Should return tracked User primary key", () => {
        const entity = { id: "ABC" };
        const trackResult = comp.trackUserById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
