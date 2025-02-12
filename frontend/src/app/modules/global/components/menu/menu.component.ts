import { Component, OnInit, HostListener } from '@angular/core';
import { MenuService } from '../../../../services/menu/menu.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GlobalModule } from '../../global.module';
import { UserById } from '../../../../models/credential.interface';
import { UserService } from '../../../../services/user/user.service';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../../services/notification/notification.service';
import { Item } from '../../../../shared/shared.module';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  animations: [
    trigger('submenuToggle',
      [
        state('collapsed',
          style({
            height: '0',
            overflow: 'hidden',
            opacity: 0
          })),
          state(
            'expanded',
            style(
              {
                height: '*',
                opacity: 1
              }
            )
          ),
          transition(
            'collapsed <=> expanded', [
              animate('300ms ease-in-out')
            ]
          )
        ]
      )
    ]
})
export class MenuComponent implements OnInit {
  isSidebarActive = false;
  currentURL = '/';
  alerts: Item[] = [];
  alertsViews: number = 0;
  menuItems: any[] = [];
  isUserMenuOpen: boolean = false;
  isNotificationsMenuOpen: boolean = false;
  loginTime: string = '0h 0m 0s';
  private loginStartTime: number;
  userEmail: string = '';
  userName: string = '';
  userRoles: string[] = [];
  roles: Map<string, string> = new Map<string, string>([
    ['Admin', 'Administrador'],
    ['Manager', 'Gerente'],
    ['Analist', 'Analista']
  ]);

  constructor(
    public global: GlobalModule,
    private menuService: MenuService,
    private router: Router,
    private auth: AuthService,
    private httpUser: UserService,
    private httpNotification: NotificationService,
  ) {
    const storedLoginTime = sessionStorage.getItem('loginTime');
    this.loginStartTime = storedLoginTime ? parseInt(storedLoginTime) : new Date().getTime();
    const userLogged = sessionStorage.getItem('userLogged');
    if (userLogged) {
      const user = JSON.parse(userLogged);
      this.getUserName(user.id).subscribe(userById => {
        this.userEmail = userById.email;
        this.userName = userById.username;
        this.userRoles = user.roles.map((item: string) => this.roles.get(item));
      });
    }
  }

  ngOnInit(): void {
    this.menuService.getMenuOptions().subscribe(data => {
      this.menuItems = data.menuItems;
      const ref = window.location.href;
      const array = ref.substring(ref.indexOf(":") + 3, ref.length).split("/");
      let URL = [];
      for (let i = 1; i < array.length; i++) {
        URL.push(array[i]);
      }
      this.currentURL = URL.join("/");
      if (this.currentURL === '')
        this.currentURL = '/'

      let id = this.currentURL.split("/")[0];
      let menuItem = this.menuItems.find(item => item.id === id);
      if (menuItem)
        menuItem.isOpen = true;
    });

    this.httpNotification.notifications$.subscribe((notifications) => {
      this.alerts = notifications;
      console.log(this.alerts);
    });

    setInterval(() => this.updateLoginTime(), 1000);
  }

  /**
   * Toggles the visibility of the sidebar.
   */
  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  /**
   * Removes a notification with the specified ID.
   *
   * This method calls the `removeNotification` method of the `httpNotification` service
   * to remove the notification with the given ID. Additionally, it decrements the
   * `alertsViews` count by 1.
   *
   * @param id - The ID of the notification to be removed.
   */
  removeNotification(id: number): void {
    this.httpNotification.removeNotification(id);
    this.alertsViews -= 1;
  }

  /**
   * Hide the visibility of the sidebar.
   */
  hideModals(): void {
    this.isSidebarActive = false;
    this.isNotificationsMenuOpen = false;
    this.isUserMenuOpen = false;
  }

  /**
   * Sets the active option in the menu.
   * @param option The ID of the option to set as active.
   */
  setActiveOption(option: string) {
    this.currentURL = option;
  }

  /**
   * Checks if a specific option is open.
   * @param option The ID of the option to check.
   * @returns True if the option is open, false otherwise.
   */
  isOpen(option: string): boolean {
    let menuItem = this.menuItems.find(item => item.id === option);
    if (menuItem)
      return menuItem.isOpen

    return false;
  }

  /**
   * Toggles the open state of a specific option.
   * @param option The ID of the option to toggle.
   */
  toggleOption(option: string) {
    let menuItem = this.menuItems.find(item => item.id === option);
    if (menuItem)
      menuItem.isOpen = !menuItem.isOpen;
  }

  /**
   * Fetches the username of a user by their ID.
   * @param id The ID of the user.
   * @returns An observable containing the username of the user.
   */
  getUserName(id: number): Observable<UserById> {
    return this.httpUser.getUserById(id);
  }

  /**
   * This function is used to logout the user.
   * It calls the logout method from the auth service and navigates the user to the login page.
   */
  logout(): void {
    this.loginTime = '0h 0m 0s';
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Toggles the visibility of the user menu.
   * Prevents the event from propagating to avoid closing the menu immediately.
   * @param event The event that triggered the toggle action.
   */
  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
    if (this.isNotificationsMenuOpen)
      this.isNotificationsMenuOpen = false;
  }


  /**
   * Toggles the state of the notifications menu.
   * This method stops the propagation of the event, updates the view count of alerts,
   * toggles the notifications menu open/close state, and ensures the user menu is closed
   * if it was open.
   * @param event - The event that triggered the toggle action.
   *
   */
  toggleNotificationsMenu(event: Event): void {
    event.stopPropagation();
    this.alertsViews = this.alerts.length;
    this.isNotificationsMenuOpen = !this.isNotificationsMenuOpen;
    if (this.isUserMenuOpen)
      this.isUserMenuOpen = false;
  }

  /**
   * Handles the document click event to determine if the user menu should be closed.
   * This method checks if the click occurred outside the user menu container.
   * If the click is outside, it sets `isUserMenuOpen` to `false`, closing the user menu.
   * @param event - The mouse event triggered by the document click.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const userMenuContainer = document.querySelector('.user-menu-container');
    if (userMenuContainer && !userMenuContainer.contains(event.target as Node)) {
      this.isUserMenuOpen = false;
    }
  }


  /**
   * Updates the login time by calculating the difference between the current time
   * and the login start time. The result is formatted as a string in the format
   * "Xh Ym Zs" where X is hours, Y is minutes, and Z is seconds.
   */
  private updateLoginTime(): void {
    const now = new Date().getTime();
    const diff = now - this.loginStartTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    this.loginTime = `${hours}h ${minutes}m ${seconds}s`;
  }

  /**
   * Navigates the user to the home page and updates the current URL.
   */
  navigateHome(): void {
   this.router.navigate(["/"]);
   this.currentURL = "/";
  }
}
