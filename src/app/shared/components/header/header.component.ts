import { Component, inject } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AccountService } from '../../../services/account.service';
import { TextareaModule } from 'primeng/textarea';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
  imports: [
    ToolbarModule, FormsModule,
    ButtonModule,
    MenubarModule,
    MenuModule,
    CommonModule,
    ModalComponent,
    DialogModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    MessageModule, InputNumber, InputTextModule, TextareaModule, IftaLabelModule
  ],
})
export class HeaderComponent {
  display = false;
  selectedType: string = 'Gasto';

  monto: number | null = null;
  cuentaSeleccionada: string | null = null;
  divisaSeleccionada: string = 'USD';
  categoriaSeleccionada: string | null = null;
  fecha: string | null = null;
  cuentas: any[] = [];
  descripcion: string | null = null;
  cuentaOrigen: string | null = null;
  cuentaDestino: string | null = null;
  
  constructor() {
    this.obtenerCuentas();
  }

  AccountService = inject(AccountService);
  TransactionService = inject(TransactionService);
  AuthService = inject(AuthService);

  obtenerCuentas() {
    this.AccountService.getAll().subscribe({
      next: (res) => {
        this.cuentas = res;
      },
      error: (err) => console.error('Error al obtener cuentas:', err)
    });
  }
  cambiarTipo(tipo: string) {
    this.selectedType = tipo;
    this.resetCampos();
  }

  categorias = [
    { label: 'Comida', value: 'comida', icon: 'pi pi-shopping-cart' },
    { label: 'Transporte', value: 'transporte', icon: 'pi pi-car' },
    { label: 'Salud', value: 'salud', icon: 'pi pi-heart' },
    { label: 'Sueldo', value: 'sueldo', icon: 'pi pi-wallet' },
  ];

  etiquetas = [
    { label: 'Trabajo', value: 'trabajo' },
    { label: 'Casa', value: 'casa' },
    { label: 'Familia', value: 'familia' },
    { label: 'Viaje', value: 'viaje' },
  ];

  openModal() {
    this.display = true;
  }

  guardarRegistro() {
    if (
      this.monto &&
      this.cuentaSeleccionada &&
      this.divisaSeleccionada &&
      this.categoriaSeleccionada &&
      this.fecha
    ) {
      

      const registro = {
        type: this.selectedType,
        amount: this.monto,
        accountId: this.cuentaSeleccionada, 
        date: this.fecha,
        description: this.descripcion,
        categoria: this.categoriaSeleccionada,
      };

      console.log('Enviando a backend:', registro);

      this.TransactionService.create(registro).subscribe({
        next: (res) => {
          console.log('Registro guardado:', res);
          this.resetCampos();
        },
        error: (err) => {
          console.error('Error al guardar el registro:', err);
          alert('Error al guardar el registro. Inténtelo nuevamente.');
        }
      });
    }
  }

  agregarYCerrarOtro() {
    if (
      this.monto &&
      this.cuentaSeleccionada &&
      this.divisaSeleccionada &&
      this.categoriaSeleccionada &&
      this.fecha
    ) {
      const registro = {
        tipo: this.selectedType,
        monto: this.monto,
        cuenta: this.cuentaSeleccionada,
        divisa: this.divisaSeleccionada,
        categoria: this.categoriaSeleccionada,
        fecha: this.fecha
      };
      console.log(' Registro y crear otro:', registro);
      this.resetCampos();
    } else {
      console.warn('⚠️ Completa todos los campos obligatorios');
    }
  }

  resetCampos() {
    this.monto = null;
    this.cuentaSeleccionada = null;
    this.categoriaSeleccionada = null;
    this.fecha = null;
    this.selectedType = 'Gasto';
    this.descripcion = null;
  }

  limitarCaracteres(event: KeyboardEvent) {
    let valorActual = (this.monto ?? '').toString();

    if (valorActual.length >= 8 && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }
  }
}
