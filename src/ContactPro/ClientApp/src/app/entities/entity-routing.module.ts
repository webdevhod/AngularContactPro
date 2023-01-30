import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      {
        path: "contact",
        data: { pageTitle: "Contacts" },
        loadChildren: () =>
          import("./contact/contact.module").then((m) => m.ContactModule),
      },
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      {
        path: "contact",
        data: { pageTitle: "Contacts" },
        loadChildren: () =>
          import("./contact/contact.module").then((m) => m.ContactModule),
      },
      {
        path: "contact",
        data: { pageTitle: "Contacts" },
        loadChildren: () =>
          import("./contact/contact.module").then((m) => m.ContactModule),
      },
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      {
        path: "contact",
        data: { pageTitle: "Contacts" },
        loadChildren: () =>
          import("./contact/contact.module").then((m) => m.ContactModule),
      },
      {
        path: "contact",
        data: { pageTitle: "Contacts" },
        loadChildren: () =>
          import("./contact/contact.module").then((m) => m.ContactModule),
      },
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      {
        path: "contact",
        data: { pageTitle: "Contacts" },
        loadChildren: () =>
          import("./contact/contact.module").then((m) => m.ContactModule),
      },
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      {
        path: "contact",
        data: { pageTitle: "Contacts" },
        loadChildren: () =>
          import("./contact/contact.module").then((m) => m.ContactModule),
      },
      {
        path: "contact",
        data: { pageTitle: "Contacts" },
        loadChildren: () =>
          import("./contact/contact.module").then((m) => m.ContactModule),
      },
      {
        path: "category",
        data: { pageTitle: "Categories" },
        loadChildren: () =>
          import("./category/category.module").then((m) => m.CategoryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
