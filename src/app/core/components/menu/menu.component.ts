import { Component, inject } from '@angular/core';
import { IMenu, MenuService } from '../../../services/menu.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [RouterModule,CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  listMenu: IMenu[];
  menuSrv = inject(MenuService);

  constructor() {
    this.listMenu = this.menuSrv.getMenu();
  }
}
