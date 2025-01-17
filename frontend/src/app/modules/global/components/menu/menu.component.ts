import { Component, OnInit, HostListener } from '@angular/core';
import { MenuService } from '../../../../services/menu/menu.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GlobalModule } from '../../global.module';

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
  isUserMenuOpen = false;
  loginTime: string = '0h 0m 0s';
  private loginStartTime: number;
  userEmail: string = '';
  userName: string = '';
  userRoles: string[] = [];

  constructor(
    public global: GlobalModule,
    private menuService: MenuService,
    private router: Router,
    private auth: AuthService
  ) {
    const storedLoginTime = sessionStorage.getItem('loginTime');
    this.loginStartTime = storedLoginTime ? parseInt(storedLoginTime) : new Date().getTime();
    const userLogged = sessionStorage.getItem('userLogged');
    if (userLogged) {
      const user = JSON.parse(userLogged);
      this.userEmail = user.info.email;
      this.userName = this.userEmail.split('@')[0]; // Extraer nombre de usuario
      this.userRoles = user.roles;
    }
  }

  //items from .json
  menuItems: any[] = [];

  ngOnInit(): void {
    this.menuService.getMenuOptions().subscribe(data => {
      this.menuItems = data.menuItems;
    });

    this.currentURL = window.location.href.substring(22, window.location.href.length);
    if (this.currentURL === '')
      this.currentURL = '/'
    console.log(this.currentURL);

    setInterval(() => this.updateLoginTime(), 1000);
  }

  isSidebarActive = false;
  currentURL = '/';

  /**
   * Toggles the visibility of the sidebar.
   */
  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  /**
   * Hide the visibility of the sidebar.
   */
  hideSidebar(): void {
    this.isSidebarActive = false;
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
   * This function is used to logout the user.
   * It calls the logout method from the auth service and navigates the user to the login page.
   */
  logout(): void {
    this.loginTime = '0h 0m 0s';
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const userMenuContainer = document.querySelector('.user-menu-container');
    if (userMenuContainer && !userMenuContainer.contains(event.target as Node)) {
      this.isUserMenuOpen = false;
    }
  }

  private updateLoginTime(): void {
    const now = new Date().getTime();
    const diff = now - this.loginStartTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    this.loginTime = `${hours}h ${minutes}m ${seconds}s`;
  }
}
