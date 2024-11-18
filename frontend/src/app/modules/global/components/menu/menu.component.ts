import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  isSidebarActive = false;
  activeOption = '';
  dropdownItem = [
    {
      id: "workCenter",
      isOpen: false
    },
    {
      id: "office",
      isOpen: false
    }
  ];

  toggleSidebar() {
    this.isSidebarActive = !this.isSidebarActive;
  }

  setActiveOption(option: string) {
    this.activeOption = option;
  }

  isOpen(option: string): boolean {
    let menuItem = this.dropdownItem.find(item => item.id === option);
    if (menuItem) {
      console.log(menuItem.isOpen);
      return menuItem.isOpen
    }

    return false;
  }

  toggleOption(option: string) {
    let menuItem = this.dropdownItem.find(item => item.id === option);
    if (menuItem)
      menuItem.isOpen = !menuItem.isOpen;
    console.log(menuItem);
  }
}
