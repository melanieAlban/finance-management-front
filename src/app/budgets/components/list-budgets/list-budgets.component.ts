import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BudgetService } from '../../../services/budget.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../../services/transaction.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


interface Categoria {
  label: string;
  value: string;
  icon: string;
}
@Component({
  selector: 'app-list-budgets',
  imports: [ ButtonModule, 
    ButtonComponent, 
    CardComponent, 
    CommonModule,
    ModalComponent, 
    InputNumberModule,
    DropdownModule, 
    FormsModule, 
    DialogModule, 
    ToastModule, 
    ConfirmDialogModule
  ],
  templateUrl: './list-budgets.component.html',
  styleUrl: './list-budgets.component.css',
  providers: [ConfirmationService, MessageService]
})
export class ListBudgetsComponent {

  private destroy$ = new Subject<void>();
  BudgetService = inject(BudgetService);
  private confirmationService = inject(ConfirmationService);
  display = false;
  cantidad: number | null = null;
  nombre: string = '';
  periodoSeleccionado: string = '';
  categoriaSeleccionada: Categoria | null = null;
  presupuestos: any[] = [];
  
  TransactionService = inject(TransactionService);
  constructor() {
    this.obtenerPresupuestos(); 
    this.TransactionService.transactionsUpdated$
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.obtenerPresupuestos(); 
          });
  }

  obtenerPresupuestos() {
    this.BudgetService.getAll().subscribe((data) => {
      this.presupuestos = data;
    });
  }
  

  

  guardarPresupuesto() {
    console.log('Datos antes de validar:', {
      cantidad: this.cantidad,
      nombre: this.nombre,
      periodoSeleccionado: this.periodoSeleccionado,
      categoriaSeleccionada: this.categoriaSeleccionada
    });
  
    if(this.cantidad && this.periodoSeleccionado && this.categoriaSeleccionada) {
      const nuevoPresupuesto = {
        period: this.periodoSeleccionado,
        category: this.categoriaSeleccionada.value,
        maxAmount: this.cantidad,
      };
      
      console.log('Enviando presupuesto:', nuevoPresupuesto);
      
      this.BudgetService.create(nuevoPresupuesto).subscribe({
        next: (data) => {
          console.log('Respuesta del servidor:', data);
          this.obtenerPresupuestos();
          this.resetCampos();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al crear presupuesto:', err);
        }
      });
    } else {
      console.warn('Faltan campos requeridos');
      // Podrías mostrar un mensaje al usuario aquí
    }
  }
  
  openModal() {
    this.display = true;
  }

  closeModal() {
    this.display = false;
  }
  limitarCaracteres(event: KeyboardEvent) {
    let valorActual = (this.cantidad ?? '').toString();

    if (valorActual.length >= 8 && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }
  }
  resetCampos() {
    this.cantidad = 0; 
    this.nombre = '';
    this.periodoSeleccionado = '';
    this.categoriaSeleccionada = null;
  }

  periodos = [
    { label: 'Semanal', value: 'SEMANAL' },
    { label: 'Mensual', value: 'MENSUAL' },
    { label: 'Anual', value: 'ANUAL' },
  ];
  
  categorias = [
    { label: 'Comida', value: 'COMIDA', icon: 'pi pi-shopping-cart' },
    { label: 'Transporte', value: 'TRANSPORTE', icon: 'pi pi-car' },
    { label: 'Salud', value: 'SALUD', icon: 'pi pi-heart' },
    { label: 'Sueldo', value: 'SUELDO', icon: 'pi pi-wallet' },
    { label: 'Entretenimiento', value: 'ENTRETENIMIENTO', icon: 'pi pi-video' },
    { label: 'Otros', value: 'OTROS', icon: 'pi pi-tags' }
  ];

  deletePresupuesto(presupuesto: any) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el presupuesto de ${presupuesto.category}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.BudgetService.delete(presupuesto.id).subscribe({
          next: () => {
            console.log('Presupuesto eliminado con éxito');
            this.obtenerPresupuestos();
          },
          error: (err) => {
            console.error('Error al eliminar presupuesto:', err);
          }
        });
      },
      reject: () => {
        // Acción al cancelar (opcional)
      }
    });
  }
}
