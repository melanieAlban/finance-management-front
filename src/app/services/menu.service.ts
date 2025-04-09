import { Injectable } from '@angular/core';

export interface IMenu{
  title: string;
  url: string;
  icon: string;
  }
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private listMenu: IMenu[] = [
    { title: 'Inicio', url: '/main', icon: 'pi pi-home' },
    { title: 'Inversiones', url: '/main/investments', icon: 'pi pi-plus-circle' },
    { title: 'Metas de Ahorro', url: '/main/goals', icon: 'pi pi-bullseye' },
    { title: 'Cuentas', url: '/main/accounts', icon: 'pi pi-wallet' },
    { title: 'Automatización', url: '/main/automation', icon: 'pi pi-credit-card' },
    { title: 'Transacciones', url: '/main/transactions', icon: 'pi pi-money-bill' },
    { title: 'Presupuestos', url: '/main/budgets', icon: 'pi pi-chart-line' }
  ]
  
  
  constructor() { }
  getMenu(){
    return [...this.listMenu];
  }

  getMenuByURL(url: string): IMenu{
    return this.listMenu.find(menu => menu.url.toLowerCase() === url.toLocaleLowerCase()) as IMenu
  }
}
