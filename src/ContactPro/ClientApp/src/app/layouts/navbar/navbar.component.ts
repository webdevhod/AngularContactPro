import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { VERSION } from "app/app.constants";
import { Account } from "app/core/auth/account.model";
import { AccountService } from "app/core/auth/account.service";
import { LoginService } from "app/login/login.service";
import { ProfileService } from "app/layouts/profiles/profile.service";
import { EntityNavbarItems } from "app/entities/entity-navbar-items";

@Component({
    selector: "jhi-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
    inProduction?: boolean;
    isNavbarCollapsed = true;
    openAPIEnabled?: boolean;
    version = "";
    account: Account | null = null;
    entitiesNavbarItems: any[] = [];
    userFullName = "Account";

    constructor(
        private loginService: LoginService,
        private accountService: AccountService,
        private profileService: ProfileService,
        private router: Router
    ) {
        if (VERSION) {
            this.version = VERSION.toLowerCase().startsWith("v")
                ? VERSION
                : `v${VERSION}`;
        }
    }

    ngOnInit(): void {
        this.entitiesNavbarItems = EntityNavbarItems;
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            this.inProduction = profileInfo.inProduction;
            this.openAPIEnabled = profileInfo.openAPIEnabled;
        });

        this.accountService.getAuthenticationState().subscribe((account) => {
            this.account = account;
            this.userFullName = account
                ? account.firstName && account.lastName
                    ? `${account.firstName} ${account.lastName}`
                    : account.email
                : "Account";
        });
    }

    isAuthenticated(): boolean {
        return this.accountService.isAuthenticated();
    }

    collapseNavbar(): void {
        this.isNavbarCollapsed = true;
    }

    login(): void {
        this.router.navigate(["/login"]);
    }

    logout(): void {
        this.collapseNavbar();
        this.loginService.logout();
        this.router.navigate([""]);
    }

    toggleNavbar(): void {
        this.isNavbarCollapsed = !this.isNavbarCollapsed;
    }

    getCurrentRoute(): string {
        return this.router.url;
    }
}
