import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../../services/menu/menu.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  //items from .json
  menuItems: any[] = [];
  login: string = 'login'

  constructor(
    private menuService: MenuService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.menuService.getMenuOptions().subscribe(data => {
      this.menuItems = data.menuItems;
    });
  }

  //properties to make the side bar interactive
  isSidebarActive = false;
  activeOption = '';

  /**
   * Toggles the visibility of the sidebar.
   */
  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  hideSidebar(): void {
    this.isSidebarActive = false;
  }

  /**
   * Sets the active option in the menu.
   * @param option The ID of the option to set as active.
   */
  setActiveOption(option: string) {
    this.activeOption = option;
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

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
