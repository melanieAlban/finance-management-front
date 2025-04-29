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
  messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  display = false;
  cantidad: number | null = null;
  nombre: string = '';
  periodoSeleccionado: string = '';
  categoriaSeleccionada: Categoria | null = null;
  presupuestos: any[] = [];
  presupuestoEditando: any = null; 
  isEditing: boolean = false;
  
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
    
  
    if(this.cantidad && this.periodoSeleccionado && this.categoriaSeleccionada) {
      const presupuesto: any = {
        period: this.periodoSeleccionado,
        category: this.categoriaSeleccionada.value,
        maxAmount: this.cantidad,
      };
  
      if (this.presupuestoEditando) {
        presupuesto.id = this.presupuestoEditando.id;
        presupuesto.userId = this.presupuestoEditando.userId; 
      }
      
      console.log('Enviando presupuesto:', presupuesto);
      
      if (this.presupuestoEditando) {
        this.BudgetService.update(presupuesto).subscribe({
          next: () => {
            this.obtenerPresupuestos();
            this.resetCampos();
            this.closeModal();
            this.presupuestoEditando = null;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Presupuesto actualizado correctamente'
            }); 
            this.isEditing = false;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',  
              summary: 'Error',
              detail: 'Error al actualizar el presupuesto'
            }); 

          }
        });
      } else {
        this.BudgetService.create(presupuesto).subscribe({
          next: () => {
            this.obtenerPresupuestos();
            this.resetCampos();
            this.closeModal();
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Presupuesto creado correctamente'
            });
            this.isEditing = false;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al crear el presupuesto'
            });
            console.error('Error al crear presupuesto:', err);
            
          }
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn',   
        summary: 'Advertencia',
        detail: 'Faltan campos requeridos'
      });
      console.warn('Faltan campos requeridos');
      
    }
  }
  
  openModal() {
    this.display = true;
  }

  closeModal() {
    this.display = false;
    this.resetCampos();
    this.isEditing = false;
    this.presupuestoEditando = null;
  }
  limitarCaracteres(event: KeyboardEvent) {
    let valorActual = (this.cantidad ?? '').toString();

    if (valorActual.length >= 8 && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
    }
  }
  resetCampos() {
    this.cantidad = null; 
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


 

editarPresupuesto(presupuesto: any) {
  this.isEditing = true;
  this.presupuestoEditando = presupuesto;
  this.cantidad = presupuesto.maxAmount;
  this.periodoSeleccionado = presupuesto.period;
  
  const categoriaEncontrada = this.categorias.find(cat => cat.value === presupuesto.category);
  this.categoriaSeleccionada = categoriaEncontrada ?? null;

  this.openModal();
}


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
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Presupuesto eliminado correctamente'
            });
            console.log('Presupuesto eliminado con éxito');
            this.obtenerPresupuestos();
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el presupuesto'
            });
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
