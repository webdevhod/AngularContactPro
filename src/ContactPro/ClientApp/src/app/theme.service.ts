import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class ThemeService {
    constructor(@Inject(DOCUMENT) private document: Document) {}

    switchTheme(theme: string): void {
        const themeLink = this.document.getElementById(
            "app-theme"
        ) as HTMLLinkElement;
        themeLink.href = theme;
    }
}

export const styles: string[] = [
    "content/themes/arya-blue/theme.css",
    "content/themes/arya-green/theme.css",
    "content/themes/arya-orange/theme.css",
    "content/themes/arya-purple/theme.css",
    "content/themes/bootstrap4-dark-blue/theme.css",
    "content/themes/bootstrap4-dark-purple/theme.css",
    "content/themes/bootstrap4-light-blue/theme.css",
    "content/themes/bootstrap4-light-purple/theme.css",
    "content/themes/fluent-light/theme.css",
    "content/themes/lara-dark-blue/theme.css",
    "content/themes/lara-dark-indigo/theme.css",
    "content/themes/lara-dark-purple/theme.css",
    "content/themes/lara-dark-teal/theme.css",
    "content/themes/lara-light-blue/theme.css",
    "content/themes/lara-light-indigo/theme.css",
    "content/themes/lara-light-purple/theme.css",
    "content/themes/lara-light-teal/theme.css",
    "content/themes/luna-amber/theme.css",
    "content/themes/luna-blue/theme.css",
    "content/themes/luna-green/theme.css",
    "content/themes/luna-pink/theme.css",
    "content/themes/md-dark-deeppurple/theme.css",
    "content/themes/md-dark-indigo/theme.css",
    "content/themes/md-light-deeppurple/theme.css",
    "content/themes/md-light-indigo/theme.css",
    "content/themes/mdc-dark-indigo/theme.css",
    "content/themes/mdc-dark-deeppurple/theme.css",
    "content/themes/mdc-light-deeppurple/theme.css",
    "content/themes/mdc-light-indigo/theme.css",
    "content/themes/nova/theme.css",
    "content/themes/nova-accent/theme.css",
    "content/themes/nova-alt/theme.css",
    "content/themes/rhea/theme.css",
    "content/themes/saga-blue/theme.css",
    "content/themes/saga-green/theme.css",
    "content/themes/saga-orange/theme.css",
    "content/themes/saga-purple/theme.css",
    "content/themes/tailwind-light/theme.css",
    "content/themes/vela-blue/theme.css",
    "content/themes/vela-green/theme.css",
    "content/themes/vela-orange/theme.css",
    "content/themes/vela-purple/theme.css",
];
