import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { MetaDataColumn } from '../../../shared/interfaces/metadatacolumn.interface';
import { TableComponent } from '../../../shared/components/table/table.component';
import { TagModule } from 'primeng/tag';

interface ClientInterface {
 name: string;
  type: string;
  
  balance: number;
  actions: string;
}
@Component({
  selector: 'app-list-accounts',
  imports: [ButtonComponent,CustomInputComponent,SelectComponent,TableComponent,TagModule],
  templateUrl: './list-accounts.component.html',
  styleUrl: './list-accounts.component.css'
})
export class ListAccountsComponent {
  tipos = [
    { name: 'Ahorros', value: 'savings' },
    { name: 'Corriente', value: 'checking' },
    { name: 'Inversión', value: 'investment' }
  ];
  data: ClientInterface[] = [
    {
     name: 'Juan Pérez',
      type: 'Ahorros',
      balance: 1500,
      actions: 'Ver Detalles'
    },
    {
      name: 'María López',
      type: 'Corriente',
      balance: 2500,
      actions: 'Ver Detalles'
    },
    {
      name: 'Carlos García',
      type: 'Inversión',
      balance: 5000,
      actions: 'Ver Detalles'
    },
    {
      name: 'Ana Martínez',
      type: 'Ahorros',
      balance: 3000,
      actions: 'Ver Detalles'
    },
    {
      name: 'Luis Fernández',
      type: 'Corriente',
      balance: 4000,
      actions: 'Ver Detalles'
    },
  ];
  metadataColumns: MetaDataColumn[] = [
    { field: 'name', title: 'Nombre' },
    { field: 'type', title: 'Tipo' },
    { field: 'balance', title: 'Balance' },
    { field: 'actions', title: 'acciones' },
    
  ];
 
  
  
}
