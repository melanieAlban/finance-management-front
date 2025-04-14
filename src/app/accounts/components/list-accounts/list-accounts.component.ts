import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { KnobModule } from 'primeng/knob';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { SelectModule } from 'primeng/select';

import { ToastComponent } from '../../../shared/components/toast/toast.component';


 interface TypeInterface {
 name: string;
  value: string;
  

}
interface BalancePorTipo {
  type: string;
  total: number;
}
@Component({
  selector: 'app-list-accounts',
  imports: [ButtonComponent,CustomInputComponent,CardComponent,KnobModule,ModalComponent,FormsModule,CommonModule,SelectModule,ToastComponent],
  templateUrl: './list-accounts.component.html',
  styleUrl: './list-accounts.component.css'
})
export class ListAccountsComponent {
 

  cuentas: any[] = [];
  balancesPorTipo: BalancePorTipo[] = [];
  AccountService= inject(AccountService);
  modalVisible: boolean = false;
  nombreCuenta: string = '';
  balanceCuenta: number = 0;
  isEditMode: boolean = false;
  idCuentaSeleccionada: number | null = null;
  filtroTipo: string = '';
  totalBalance: number = 0;
  severity: string = '';
  summary: string = '';
  detail: string = '';
  cuentaAEliminar: any = null; 
  isConfirming: boolean = false; 
  constructor() {
    this.obtenerCuentas();
    this.obtenerTotalBalance();
  }
  showConfirm(cuenta: any) {
    this.cuentaAEliminar = cuenta;
    this.isConfirming = true; 
    this.severity = 'warn';
    this.summary = '¿Está seguro que desea eliminar esta cuenta?';
    this.detail = `Cuenta: ${cuenta.name}`;
  }

  tipos:TypeInterface[] = [
    { name: 'Tarjeta de crédito', value: 'CREDIT_CARD' }, 
    { name: 'Tarjeta de débito', value: 'DEBIT_CARD' },
    { name: 'Cuenta bancaria', value: 'BANK_ACCOUNT' },
    { name: 'Efectivo', value: 'CASH' }
  ];

  tipoCuenta: string = "";

  obtenerTotalBalance() {
    this.AccountService.getTotalBalance().subscribe({
      next: (res) => {
        this.totalBalance = res; 
      },
      error: (err) => console.error('Error al obtener total balance:', err)
    });

    this.balancesPorTipo = this.tipos.map(tipo => {
      const total = this.cuentas
        .filter(c => c.type === tipo.value)
        .reduce((sum, c) => sum + c.balance, 0);
      return { type: tipo.name, total };
    });
  }

  getTipoClass(tipo: string) {
    switch (tipo) {
      case 'CREDIT_CARD':
        return 'bg-blue-100 text-blue-800'; 
      case 'DEBIT_CARD':
        return 'bg-green-100 text-green-800';  
      case 'BANK_ACCOUNT':
        return 'bg-purple-100 text-purple-800';  
      case 'CASH':
        return 'bg-yellow-100 text-yellow-800'; 
      default:
        return '';  
    }
  }

  obtenerCuentas() {
    this.AccountService.getAll().subscribe({
      next: (res) => {
        this.cuentas = res;
        this.obtenerTotalBalance();
      },
      error: (err) => console.error('Error al obtener cuentas:', err)
    });
  }

  getTypeName(tipo: string): string {
    return this.tipos.find(t => t.value === tipo)?.name! ;
    
  }

  get cuentasFiltradas() {
    if (!this.filtroTipo) return this.cuentas;
    return this.cuentas.filter(c => c.type === this.filtroTipo);
  }
  

  editarCuenta(cuenta: any) {
    this.isEditMode = true;
    this.modalVisible = true;
    this.idCuentaSeleccionada = cuenta.id;
    this.nombreCuenta = cuenta.name;
    this.tipoCuenta = cuenta.type;
    this.balanceCuenta = cuenta.balance;
  }
  

  guardarCuenta() {
    const nuevaCuenta = {
      id: this.idCuentaSeleccionada,
      name: this.nombreCuenta,
      type: this.tipoCuenta,
      balance: this.balanceCuenta
    };

    if (this.isEditMode && nuevaCuenta.id != null) {
      this.AccountService.update(nuevaCuenta).subscribe({
        next: (res) => {
          console.log('Cuenta actualizada:', res);
          this.severity = 'success';
          this.summary = 'Cuenta actualizada';
          this.detail = `La cuenta "${nuevaCuenta.name}" ha sido creada con éxito.`;
          this.obtenerCuentas();
          this.resetForm();
        },
        error: (err) => {console.error('Error al actualizar cuenta:', err)
            
            this.severity = 'error';
            this.summary = 'Error';
            this.detail = 'No se pudo actualizar la cuenta. Inténtelo nuevamente.';
        }
        
      });
    } else {
      this.AccountService.create(nuevaCuenta).subscribe({
        next: (res) => {
          console.log('Cuenta creada:', res);
          this.severity = 'success';
          this.summary = 'Cuenta creada';
          this.detail = `La cuenta "${nuevaCuenta.name}" ha sido creada con éxito.`;
          this.obtenerCuentas();
          this.resetForm();
        },
        error: (err) => {console.error('Error al crear cuenta:', err)
              
              this.severity = 'error';
              this.summary = 'Error';
              this.detail = 'No se pudo crear la cuenta. Inténtelo nuevamente.';
        }
      });
    }
  
    this.modalVisible = false;
    
  }

  eliminarCuenta(cuenta: any) {
    if (confirm(`¿Está seguro que desea eliminar la cuenta "${cuenta.name}"?`)) {
      this.AccountService.delete(cuenta.id).subscribe({
        next: () => {
          console.log('Cuenta eliminada con éxito');
          this.obtenerCuentas(); 
          this.severity = 'success';
          this.summary = 'Cuenta eliminada';
          this.detail = `La cuenta "${cuenta.name}" fue eliminada con éxito.`;
        },
        error: (err) => {
          console.error('Error al eliminar cuenta:', err);
          this.severity = 'error';
          this.summary = 'Error';
          this.detail = 'No se pudo eliminar la cuenta. Inténtelo nuevamente.';
        }
      });
    }
  }
  
  cancelar() {
    this.modalVisible = false;
    this.resetForm(); 
  }

  resetForm() {
    this.nombreCuenta = '';
    this.balanceCuenta = 0;
    this.tipoCuenta = this.tipos[0].value;
    this.idCuentaSeleccionada = null; 
    this.isEditMode = false;
  }
  
  
}
