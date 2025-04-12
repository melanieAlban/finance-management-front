import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { MetaDataColumn } from '../../../shared/interfaces/metadatacolumn.interface';
import { TableComponent } from '../../../shared/components/table/table.component';

import { CardComponent } from '../../../shared/components/card/card.component';
import { KnobModule } from 'primeng/knob';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';


 interface TypeInterface {
 name: string;
  value: string;
  

}
@Component({
  selector: 'app-list-accounts',
  imports: [ButtonComponent,CustomInputComponent,SelectComponent,CardComponent,KnobModule,ModalComponent,FormsModule],
  templateUrl: './list-accounts.component.html',
  styleUrl: './list-accounts.component.css'
})
export class ListAccountsComponent {
  AccountService= inject(AccountService);
  value: number = 500;
  modalVisible: boolean = false;
  nombreCuenta: string = '';

  balanceCuenta: number = 0;

  tipos:TypeInterface[] = [
    { name: 'Tarjeta de crédito', value: 'CREDIT_CARD' },
    { name: 'Tarjeta de débito', value: 'DEBIT_CARD' },
    { name: 'Cuenta bancaria', value: 'BANK_ACCOUNT' },
    { name: 'Efectivo', value: 'CASH' }
  ];
  tipoCuenta: TypeInterface = this.tipos[0];

  guardarCuenta() {
    const nuevaCuenta = {
      nombre: this.nombreCuenta,
      tipo: this.tipoCuenta?.value,
      balance: this.balanceCuenta
    };


    this.AccountService.create(nuevaCuenta).subscribe({
      next: (res) => {
        console.log(' Cuenta creada con éxito:', res);
        this.modalVisible = false;
        this.nombreCuenta = '';
        this.tipoCuenta = this.tipos[0];;
        this.balanceCuenta = 0;
      },
      error: (err) => {
        console.error('Error al crear cuenta:', err);
      }
    });
  }
 
  
  
}
