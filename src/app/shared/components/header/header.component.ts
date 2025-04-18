import { Component } from '@angular/core';
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
    MessageModule,InputNumber, InputTextModule
  ],
})
export class HeaderComponent {
  display = false;
  selectedType: string = 'Gasto';

  monto: number | null = null;
  cuentaSeleccionada: string | null = null;
  divisaSeleccionada: string = 'USD';
  categoriaSeleccionada: string | null = null;
  etiquetaSeleccionada: string | null = null;
  fecha: string | null = null;
  hora: string | null = null;

  cuentas = [
    { label: 'Cuenta Corriente', value: 'corriente' },
    { label: 'Tarjeta Crédito', value: 'credito' },
    { label: 'Ahorros', value: 'ahorros' },
  ];

  categorias = [
    { label: 'Comida', value: 'comida', icon: 'pi pi-shopping-bag' },
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
      this.fecha &&
      this.hora
    ) {
      const registro = {
        tipo: this.selectedType,
        monto: this.monto,
        cuenta: this.cuentaSeleccionada,
        divisa: this.divisaSeleccionada,
        categoria: this.categoriaSeleccionada,
        etiqueta: this.etiquetaSeleccionada,
        fecha: this.fecha,
        hora: this.hora,
      };
      console.log('✅ Registro guardado:', registro);
      this.display = false;
      this.resetCampos();
    } else {
      console.warn('⚠️ Completa todos los campos obligatorios');
    }
  }

  agregarYCerrarOtro() {
    if (
      this.monto &&
      this.cuentaSeleccionada &&
      this.divisaSeleccionada &&
      this.categoriaSeleccionada &&
      this.fecha &&
      this.hora
    ) {
      const registro = {
        tipo: this.selectedType,
        monto: this.monto,
        cuenta: this.cuentaSeleccionada,
        divisa: this.divisaSeleccionada,
        categoria: this.categoriaSeleccionada,
        etiqueta: this.etiquetaSeleccionada,
        fecha: this.fecha,
        hora: this.hora,
      };
      console.log('✅ Registro y crear otro:', registro);
      this.resetCampos();
    } else {
      console.warn('⚠️ Completa todos los campos obligatorios');
    }
  }

  resetCampos() {
    this.monto = null;
    this.cuentaSeleccionada = null;
    this.categoriaSeleccionada = null;
    this.etiquetaSeleccionada = null;
    this.fecha = null;
    this.hora = null;
    this.selectedType = 'Gasto';
  }

  

  limitarCaracteres(event: KeyboardEvent) {
    let valorActual = (this.monto ?? '').toString();
    
    // Evitar que se pueda escribir si ya se alcanzaron los 6 caracteres
    if (valorActual.length >= 8 && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault(); // Detener la acción de escribir más caracteres
    }
  }
  
}
