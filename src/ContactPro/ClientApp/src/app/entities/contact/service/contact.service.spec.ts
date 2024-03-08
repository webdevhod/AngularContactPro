import { TestBed } from "@angular/core/testing";
import {
    HttpClientTestingModule,
    HttpTestingController,
} from "@angular/common/http/testing";
import dayjs from "dayjs/esm";

import { DATE_FORMAT, DATE_TIME_FORMAT_UTC } from "app/config/input.constants";
import { States } from "app/entities/enumerations/states.model";
import { IContact, Contact } from "../contact.model";

import { ContactService } from "./contact.service";

describe("Contact Service", () => {
    let service: ContactService;
    let httpMock: HttpTestingController;
    let elemDefault: IContact;
    let expectedResult: IContact | IContact[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        expectedResult = null;
        service = TestBed.inject(ContactService);
        httpMock = TestBed.inject(HttpTestingController);
        currentDate = dayjs();

        elemDefault = {
            id: 0,
            firstName: "AAAAAAA",
            lastName: "AAAAAAA",
            address1: "AAAAAAA",
            address2: "AAAAAAA",
            city: "AAAAAAA",
            state: States.AK,
            zipCode: "AAAAAAA",
            email: "AAAAAAA",
            phoneNumber: "AAAAAAA",
            birthDate: currentDate,
            created: currentDate,
            imageDataContentType: "image/png",
            imageData: "AAAAAAA",
            imageType: "AAAAAAA",
        };
    });

    describe("Service methods", () => {
        it("should find an element", () => {
            const returnedFromService = Object.assign(
                {
                    birthDate: currentDate.format(DATE_FORMAT),
                    created: currentDate.format(DATE_TIME_FORMAT_UTC),
                },
                elemDefault
            );

            service.find(123).subscribe((resp) => (expectedResult = resp.body));

            const req = httpMock.expectOne({ method: "GET" });
            req.flush(returnedFromService);
            expect(expectedResult).toMatchObject(elemDefault);
        });

        it("should create a Contact", () => {
            const returnedFromService = Object.assign(
                {
                    id: 0,
                    birthDate: currentDate.format(DATE_FORMAT),
                    created: currentDate.format(DATE_TIME_FORMAT_UTC),
                },
                elemDefault
            );

            const expected = Object.assign(
                {
                    birthDate: currentDate,
                    created: currentDate,
                },
                returnedFromService
            );

            service
                .create(new Contact())
                .subscribe((resp) => (expectedResult = resp.body));

            const req = httpMock.expectOne({ method: "POST" });
            req.flush(returnedFromService);
            expect(expectedResult).toMatchObject(expected);
        });

        it("should update a Contact", () => {
            const returnedFromService = Object.assign(
                {
                    id: 1,
                    firstName: "BBBBBB",
                    lastName: "BBBBBB",
                    address1: "BBBBBB",
                    address2: "BBBBBB",
                    city: "BBBBBB",
                    state: "BBBBBB",
                    zipCode: "BBBBBB",
                    email: "BBBBBB",
                    phoneNumber: "BBBBBB",
                    birthDate: currentDate.format(DATE_FORMAT),
                    created: currentDate.format(DATE_TIME_FORMAT_UTC),
                    imageData: "BBBBBB",
                    imageType: "BBBBBB",
                },
                elemDefault
            );

            const expected = Object.assign(
                {
                    birthDate: currentDate,
                    created: currentDate,
                },
                returnedFromService
            );

            service
                .update(expected)
                .subscribe((resp) => (expectedResult = resp.body));

            const req = httpMock.expectOne({ method: "PUT" });
            req.flush(returnedFromService);
            expect(expectedResult).toMatchObject(expected);
        });

        it("should partial update a Contact", () => {
            const patchObject = Object.assign(
                {
                    firstName: "BBBBBB",
                    address1: "BBBBBB",
                    zipCode: "BBBBBB",
                    email: "BBBBBB",
                },
                new Contact()
            );

            const returnedFromService = Object.assign(patchObject, elemDefault);

            const expected = Object.assign(
                {
                    birthDate: currentDate,
                    created: currentDate,
                },
                returnedFromService
            );

            service
                .partialUpdate(patchObject)
                .subscribe((resp) => (expectedResult = resp.body));

            const req = httpMock.expectOne({ method: "PATCH" });
            req.flush(returnedFromService);
            expect(expectedResult).toMatchObject(expected);
        });

        it("should return a list of Contact", () => {
            const returnedFromService = Object.assign(
                {
                    id: 1,
                    firstName: "BBBBBB",
                    lastName: "BBBBBB",
                    address1: "BBBBBB",
                    address2: "BBBBBB",
                    city: "BBBBBB",
                    state: "BBBBBB",
                    zipCode: "BBBBBB",
                    email: "BBBBBB",
                    phoneNumber: "BBBBBB",
                    birthDate: currentDate.format(DATE_FORMAT),
                    created: currentDate.format(DATE_TIME_FORMAT_UTC),
                    imageData: "BBBBBB",
                    imageType: "BBBBBB",
                },
                elemDefault
            );

            const expected = Object.assign(
                {
                    birthDate: currentDate,
                    created: currentDate,
                },
                returnedFromService
            );

            service.query().subscribe((resp) => (expectedResult = resp.body));

            const req = httpMock.expectOne({ method: "GET" });
            req.flush([returnedFromService]);
            httpMock.verify();
            expect(expectedResult).toContainEqual(expected);
        });

        it("should delete a Contact", () => {
            service.delete(123).subscribe((resp) => (expectedResult = resp.ok));

            const req = httpMock.expectOne({ method: "DELETE" });
            req.flush({ status: 200 });
            expect(expectedResult);
        });

        describe("addContactToCollectionIfMissing", () => {
            it("should add a Contact to an empty array", () => {
                const contact: IContact = { id: 123 };
                expectedResult = service.addContactToCollectionIfMissing(
                    [],
                    contact
                );
                expect(expectedResult).toHaveLength(1);
                expect(expectedResult).toContain(contact);
            });

            it("should not add a Contact to an array that contains it", () => {
                const contact: IContact = { id: 123 };
                const contactCollection: IContact[] = [
                    {
                        ...contact,
                    },
                    { id: 456 },
                ];
                expectedResult = service.addContactToCollectionIfMissing(
                    contactCollection,
                    contact
                );
                expect(expectedResult).toHaveLength(2);
            });

            it("should add a Contact to an array that doesn't contain it", () => {
                const contact: IContact = { id: 123 };
                const contactCollection: IContact[] = [{ id: 456 }];
                expectedResult = service.addContactToCollectionIfMissing(
                    contactCollection,
                    contact
                );
                expect(expectedResult).toHaveLength(2);
                expect(expectedResult).toContain(contact);
            });

            it("should add only unique Contact to an array", () => {
                const contactArray: IContact[] = [
                    { id: 123 },
                    { id: 456 },
                    { id: 87161 },
                ];
                const contactCollection: IContact[] = [{ id: 123 }];
                expectedResult = service.addContactToCollectionIfMissing(
                    contactCollection,
                    ...contactArray
                );
                expect(expectedResult).toHaveLength(3);
            });

            it("should accept varargs", () => {
                const contact: IContact = { id: 123 };
                const contact2: IContact = { id: 456 };
                expectedResult = service.addContactToCollectionIfMissing(
                    [],
                    contact,
                    contact2
                );
                expect(expectedResult).toHaveLength(2);
                expect(expectedResult).toContain(contact);
                expect(expectedResult).toContain(contact2);
            });

            it("should accept null and undefined values", () => {
                const contact: IContact = { id: 123 };
                expectedResult = service.addContactToCollectionIfMissing(
                    [],
                    null,
                    contact,
                    undefined
                );
                expect(expectedResult).toHaveLength(1);
                expect(expectedResult).toContain(contact);
            });

            it("should return initial array if no Contact is added", () => {
                const contactCollection: IContact[] = [{ id: 123 }];
                expectedResult = service.addContactToCollectionIfMissing(
                    contactCollection,
                    undefined,
                    null
                );
                expect(expectedResult).toEqual(contactCollection);
            });
        });
    });

    afterEach(() => {
        httpMock.verify();
    });
});
