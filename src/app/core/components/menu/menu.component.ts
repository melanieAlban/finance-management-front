import { Component, inject } from '@angular/core';
import { IMenu, MenuService } from '../../../services/menu.service';
import { Router, RouterModule } from '@angular/router';
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
  router = inject(Router);

  constructor() {
    this.listMenu = this.menuSrv.getMenu();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
