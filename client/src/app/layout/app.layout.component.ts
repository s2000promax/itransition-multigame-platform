import { Component, Renderer2, ViewChild } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from '@services/app.layout.service';
import { AppTopBarComponent } from '@layout/components/topbar/app.topbar.component';
import { ColorStyles } from '@config/styles/colorStyles';

type ProfileMenuListener = () => void;

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
})
export class AppLayoutComponent {
    overlayMenuOpenSubscription: Subscription;

    profileMenuOutsideClickListener!: ProfileMenuListener | null;

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
    ) {
        this.overlayMenuOpenSubscription =
            this.layoutService.overlayOpen$.subscribe(() => {
                if (!this.profileMenuOutsideClickListener) {
                    this.profileMenuOutsideClickListener = this.renderer.listen(
                        'document',
                        'click',
                        (event) => {
                            const isOutsideClicked = !(
                                this.appTopbar.menu.nativeElement.isSameNode(
                                    event.target,
                                ) ||
                                this.appTopbar.menu.nativeElement.contains(
                                    event.target,
                                ) ||
                                this.appTopbar.topbarMenuButton.nativeElement.isSameNode(
                                    event.target,
                                ) ||
                                this.appTopbar.topbarMenuButton.nativeElement.contains(
                                    event.target,
                                )
                            );

                            if (isOutsideClicked) {
                                this.hideSidebarMenu();
                            }
                        },
                    );
                }
            });

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideSidebarMenu();
            });
    }

    hideSidebarMenu(): void {
        this.layoutService.state.menuSidebarVisible = false;
        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }

    get containerClass() {
        return {
            'layout-theme-light':
                this.layoutService.config.colorScheme === ColorStyles.LIGHT,
            'layout-theme-dark':
                this.layoutService.config.colorScheme === ColorStyles.DARK,
        };
    }
}
