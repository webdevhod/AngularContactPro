import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { IContact } from "../contact.model";
import { ContactService } from "../service/contact.service";
import { ContactDeleteDialogComponent } from "../delete/contact-delete-dialog.component";
import { DataUtils } from "app/core/util/data-util.service";

@Component({
  selector: "jhi-contact",
  templateUrl: "./contact.component.html",
})
export class ContactComponent implements OnInit {
  contacts?: IContact[];
  isLoading = false;

  constructor(
    protected contactService: ContactService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.contactService.query().subscribe({
      next: (res: HttpResponse<IContact[]>) => {
        this.isLoading = false;
        this.contacts = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
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
      size: "lg",
      backdrop: "static",
    });
    modalRef.componentInstance.contact = contact;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe((reason) => {
      if (reason === "deleted") {
        this.loadAll();
      }
    });
  }
}
