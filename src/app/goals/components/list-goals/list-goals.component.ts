import { CommonModule } from '@angular/common';
import { Component, inject,ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuItem } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { GoalsService } from '../../../services/goals.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


interface Frequency {
  value: string;
  label: string;
}
interface Goal {
  name: string;
  targetAmount: number | null;
  deadline: Date | null;
  depositFrequency: string | null;
  lastDepositDate: Date | null; 
  currentBalance?: number | null; // Añadido para el saldo actual
  creationDate?: Date | null; // Añadido para la fecha de creación
}
@Component({
  selector: 'app-list-goals',
  imports: [CardModule,ProgressBarModule,ButtonModule,CommonModule,MenuModule,DialogModule,DropdownModule,
    CalendarModule,CheckboxModule,ToastModule,FormsModule,ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './list-goals.component.html',
  styleUrl: './list-goals.component.css'
})
export class ListGoalsComponent {
  @ViewChild('menu') menu: any;
  goals: any[] = [];
  currentGoal: any = null; 
  progressValue: number = 0;
  GoalsService= inject(GoalsService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  displayCreateGoalModal: boolean = false;
  displayAddPaymentModal: boolean = false;
  displayEditFrequencyModal: boolean = false;
  formSubmitted: boolean = false;
  suggestedAmount: number = 0;
  isEditing: boolean = false;
  constructor(){
    this.loadGoals();
  }
  menuItems: MenuItem[] = [
    {
      label: 'Editar',
      icon: 'pi pi-pencil',
      styleClass: 'edit-item',
      command: () => {
        this.editGoal(this.currentGoal); 
      },
      
    },
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      styleClass: 'delete-item',
      command: () => {
        this.confirmDelete(this.currentGoal);
      },
    },
  ];
  newGoal: Goal = {
    name: '',
    targetAmount: null,
    deadline: null,
    depositFrequency: null,
    lastDepositDate: new Date(),
  };

  paymentAmount: number | null = null;

  // Lista de frecuencias para el dropdown de creación
  frequencies: Frequency[] = [
    { label: 'Diariamente', value: 'DAILY' },
    { label: 'Semanalmente', value: 'WEEKLY' },
    { label: 'Mensualmente', value: 'MONTHLY' },
  ];
  private frequencyLabels: { [key: string]: string } = {
    DAILY: 'Diariamente',
    WEEKLY: 'Semanalmente',
    BIWEEKLY: 'Quincenalmente',
    MONTHLY: 'Mensualmente',
  };
  getFrequencyLabel(frequency: string): string {
    return this.frequencyLabels[frequency] || frequency;
  }

  // Lista de frecuencias para el dropdown de edición
  editFrequencies: Frequency[] = [
    { label: 'Diariamente', value: 'DAILY' },
    { label: 'Semanalmente', value: 'WEEKLY' },
    { label: 'Mensualmente', value: 'MONTHLY' },
  ];
  loadGoals(): void {
    this.GoalsService.getAll().subscribe({
      next: (res) => {
        this.goals = res;
        if (res && res.length > 0) {
          this.goals.forEach((goal) => this.calculateProgressForGoal(goal));
          this.currentGoal = res[0]; 
          this.calculateProgress();
        } else {
          this.currentGoal = null;
          this.messageService.add({
            severity: 'info',
            summary: 'Sin Metas',
            detail: 'No tienes metas de ahorro. Crea una nueva meta para empezar.',
          });
        }
      },
      error: (err) => {
        console.error('Error al obtener metas:', err);
        this.goals = [];
        this.currentGoal = null;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las metas. Inténtelo nuevamente.',
        });
      },
    });
  }
  calculateProgress(): void {
    if (this.currentGoal && this.currentGoal.targetAmount && this.currentGoal.currentBalance) {
      // Calcular el porcentaje de progreso
      const progress = (this.currentGoal.currentBalance / this.currentGoal.targetAmount) * 100;
  
      // Redondear el progreso a un valor entero sin decimales
      this.progressValue = Math.floor(progress); // Eliminar decimales
    } else {
      this.progressValue = 0;
    }
  }
  
 
  selectedFrequency: string | null = null;
  
  editSuggestedAmount: string = '$0.00';
 
  today: Date = new Date();
  showCreateGoalModal() {
    this.displayCreateGoalModal = true;
    
  }
  
 
  hideCreateGoalModal() {
    this.displayCreateGoalModal = false;
    
  }
  openAddPaymentModal() {
    this.displayAddPaymentModal = true;
  }
  closeAddPaymentModal() {
    this.displayAddPaymentModal = false;
  }
  openEditFrequencyModal() {
    this.displayEditFrequencyModal = true;
    this.selectedFrequency = null;
    this.editSuggestedAmount = '$0.00';
  }

  saveGoal() {
    this.formSubmitted = true;
  
    if (
      this.newGoal.name &&
      this.newGoal.targetAmount !== null &&
      this.newGoal.deadline &&
      this.newGoal.depositFrequency &&
      this.newGoal.lastDepositDate
    ) {
      const formattedGoal = {
        ...this.newGoal,
        lastDepositDate: this.newGoal.lastDepositDate.toISOString(),
        deadline: this.newGoal.deadline.toISOString(),
      };
  
      if (this.isEditing) {
        this.GoalsService.update(formattedGoal).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Meta Actualizada',
              detail: 'La meta fue actualizada correctamente.',
            });
            this.resetModal();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo actualizar la meta.',
            });
          },
        });
      } else {
        const creationDate = new Date();
        formattedGoal.creationDate = creationDate;
        formattedGoal.currentBalance = this.newGoal.currentBalance || 0;
  
        this.GoalsService.create(formattedGoal).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Meta Creada',
              detail: 'La meta fue creada correctamente.',
            });
            this.resetModal();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo crear la meta.',
            });
          },
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor, completa todos los campos.',
      });
    }
  }
  resetModal() {
    this.displayCreateGoalModal = false;
    this.isEditing = false;
    this.formSubmitted = false;
    this.newGoal = {
      name: '',
      targetAmount: null,
      deadline: null,
      depositFrequency: null,
      lastDepositDate: new Date(),
      currentBalance: 0,
      creationDate: new Date(),
    };
    
    this.loadGoals();
  }
  
  calculateSuggestedAmount() {
    if (!this.newGoal.targetAmount || !this.newGoal.deadline) {
      this.suggestedAmount = 0;
      return;
    }

    const totalAmount = this.newGoal.targetAmount;
    const deadline = new Date(this.newGoal.deadline);
    const today = new Date();
    const timeDiff = deadline.getTime() - today.getTime();
    const daysToGo = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Días hasta la fecha límite

    let amountPerFrequency: number = 0;

    switch (this.newGoal.depositFrequency) {
      case 'DAILY':
        amountPerFrequency = totalAmount / daysToGo;
        break;
      case 'WEEKLY':
        amountPerFrequency = totalAmount / (daysToGo / 7);
        break;
      case 'MONTHLY':
        amountPerFrequency = totalAmount / (daysToGo / 30);
        break;
        
    }
    this.suggestedAmount = parseFloat(amountPerFrequency.toFixed(2));
   
  }
  ngOnChanges() {
    this.calculateSuggestedAmount();
  }

  // Llamado cuando la frecuencia cambia
  onFrequencyChange() {
    this.calculateSuggestedAmount();
  }
  calculateSuggestedAmountForGoal(goal: any): string {
    if (!goal.targetAmount || !goal.deadline || !goal.depositFrequency) {
      return '$0.00';
    }
  
    const totalAmount = goal.targetAmount;
    const deadline = new Date(goal.deadline);
    const today = new Date();
    const timeDiff = deadline.getTime() - today.getTime();
    const daysToGo = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Días hasta la fecha límite
  
    let amountPerFrequency: number = 0;
  
    switch (goal.depositFrequency) {
      case 'DAILY':
        amountPerFrequency = totalAmount / daysToGo;
        break;
      case 'WEEKLY':
        amountPerFrequency = totalAmount / Math.ceil(daysToGo / 7);
        break;
      case 'MONTHLY':
        amountPerFrequency = totalAmount / Math.ceil(daysToGo / 30);
        break;
      default:
        return '$0.00';
    }
  
    return `$${amountPerFrequency.toFixed(2)}`;
  }
  editGoal(goal: any) {
    this.isEditing = true;
  this.formSubmitted = false;

  const parsedGoal = {
    ...goal,
    deadline: goal.deadline instanceof Date ? goal.deadline : new Date(goal.deadline),
    lastDepositDate: goal.lastDepositDate instanceof Date ? goal.lastDepositDate : new Date(goal.lastDepositDate),
  };

  this.newGoal = parsedGoal;
  this.displayCreateGoalModal = true;
  }
  confirmDelete(goal: any) {
    console.log("Confirm Delete called", goal);
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar esta meta?',
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.GoalsService.delete(goal.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Meta eliminada',
              detail: 'La meta fue eliminada correctamente.',
            });
            this.resetModal();
            this.loadGoals(); // recargar lista
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la meta.',
            });
          }
        });
      }
    });
  }
  openMenu(event: Event, goal: any): void {
    console.log('Abriendo menú para meta:', goal); // Depuración
    this.currentGoal = goal; // Asignar la meta seleccionada
    this.menu.toggle(event); // Abrir el menú contextual
  }
  
  addPayment() {
    if (this.paymentAmount && this.paymentAmount > 0 && this.currentGoal) {
      // Incrementar el saldo actual de la meta seleccionada
      this.currentGoal.currentBalance = (this.currentGoal.currentBalance || 0) + this.paymentAmount;
      this.currentGoal.lastDepositDate = new Date();
      // Recalcular el progreso solo para esta meta
      this.calculateProgressForGoal(this.currentGoal);
  
      // Llamar al servicio para actualizar el saldo de la meta
      this.GoalsService.update(this.currentGoal).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Abono agregado',
            detail: `Se agregó $${this.paymentAmount} a la meta.`,
          });
          this.displayAddPaymentModal = false; // Cerrar el modal
          this.paymentAmount = 0; // Limpiar el campo de monto
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo agregar el abono.',
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Monto inválido',
        detail: 'Por favor, ingresa un monto válido.',
      });
    }
  }
  selectGoal(goal: any): void {
    this.currentGoal = goal; // Asignamos la meta seleccionada a currentGoal
    this.calculateProgressForGoal(goal); // Recalcular el progreso de esa meta, si es necesario
    this.displayAddPaymentModal = true; // Mostrar el modal de agregar fondos
  }
  
  calculateProgressForGoal(goal: any): void {
    if (goal && goal.targetAmount && goal.currentBalance >= 0) {
      const progress = (goal.currentBalance / goal.targetAmount) * 100;
      goal.progressValue = Math.floor(progress); // Sin decimales
    } else {
      goal.progressValue = 0;
    }
  }
  
  openCreateGoalModal(): void {
    this.newGoal = {
      name: '',
      targetAmount: null,
      currentBalance: 0,
      deadline: null,
      lastDepositDate: new Date(),
      creationDate: null,
  
      depositFrequency: null,
      
      
    };
   
    this.formSubmitted = false;
    this.displayCreateGoalModal = true;
    this.isEditing = false; 
  }
  

}
