import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {

  menuItems: any[] = [];

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.menuService.getMenuOptions().subscribe(data => {
      this.menuItems = data.menuItems;
      console.log(this.menuItems);
    });
  }

  isSidebarActive = false;
  activeOption = '';

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  setActiveOption(option: string) {
    this.activeOption = option;
  }

  isOpen(option: string): boolean {
    let menuItem = this.menuItems.find(item => item.id === option);
    if (menuItem)
      return menuItem.isOpen

    return false;
  }

  toggleOption(option: string) {
    let menuItem = this.menuItems.find(item => item.id === option);
    if (menuItem)
      menuItem.isOpen = !menuItem.isOpen;
  }
}
