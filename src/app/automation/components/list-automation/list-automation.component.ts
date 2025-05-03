import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { SelectModule } from 'primeng/select';
import { KnobModule } from 'primeng/knob';
import { AutomationService, Automation } from '../../../services/automation.service';
import { AccountService } from '../../../services/account.service';

interface FrequencyInterface {
  name: string;
  value: string;
}

interface AccountInterface {
  id: number;
  name: string;
}

interface CategoryInterface {
  name: string;
  value: string;
}

@Component({
  selector: 'app-list-automation',
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CustomInputComponent,
    CardComponent,
    ModalComponent,
    ToastComponent,
    SelectModule,
    KnobModule
  ],
  templateUrl: './list-automation.component.html',
  styleUrls: ['./list-automation.component.css'],
  standalone: true
})
export class ListAutomationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  automations: Automation[] = [];
  accounts: AccountInterface[] = [];
  modalVisible: boolean = false;
  confirmModalVisible: boolean = false;
  isEditMode: boolean = false;
  idAutomationSeleccionada: number | null = null;
  nameAutomation: string = ''; // Nuevo campo para el nombre
  amountAutomation: number = 0;
  frequencyAutomation: string = '';
  startDateAutomation: string = '';
  accountIdAutomation: number | null = null;
  categoryAutomation: string = '';
  filtroFrecuencia: string = '';
  filtroCategoria: string = '';
  severity: string = '';
  summary: string = '';
  detail: string = '';
  automationToDelete: Automation | null = null;

  automationService = inject(AutomationService);
  accountService = inject(AccountService);

  frequencies: FrequencyInterface[] = [
    { name: 'Diaria', value: 'DAILY' },
    { name: 'Semanal', value: 'WEEKLY' },
    { name: 'Mensual', value: 'MONTHLY' }
  ];

  categories: CategoryInterface[] = [
    { name: 'Comida', value: 'COMIDA' },
    { name: 'Transporte', value: 'TRANSPORTE' },
    { name: 'Sueldo', value: 'SUELDO' },
    { name: 'Salud', value: 'SALUD' },
    { name: 'Vivienda', value: 'VIVIENDA' },
    { name: 'Entretenimiento', value: 'ENTRETENIMIENTO' },
    { name: 'Otros', value: 'OTROS' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.obtenerAutomations();
    this.obtenerAccounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  obtenerAutomations() {
    this.automationService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        console.log('Automatizaciones recibidas:', res);
        this.automations = res;
      },
      error: (err) => {
        console.error('Error al obtener automatizaciones:', err);
        this.severity = 'error';
        this.summary = 'Error';
        this.detail = 'No se pudieron cargar las automatizaciones. Inténtelo nuevamente.';
      }
    });
  }

  obtenerAccounts() {
    this.accountService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        console.log('Cuentas recibidas:', res);
        this.accounts = res.map((account: any) => ({
          id: account.id,
          name: account.name
        }));
        console.log('Cuentas mapeadas:', this.accounts);
      },
      error: (err) => {
        console.error('Error al obtener cuentas:', err);
        this.severity = 'error';
        this.summary = 'Error';
        this.detail = 'No se pudieron cargar las cuentas. Inténtelo nuevamente.';
      }
    });
  }

  get automationsFiltradas() {
    let filtered = this.automations;
    if (this.filtroFrecuencia) {
      filtered = filtered.filter(a => a.frequency === this.filtroFrecuencia);
    }
    if (this.filtroCategoria) {
      filtered = filtered.filter(a => a.category === this.filtroCategoria);
    }
    return filtered;
  }

  getFrequencyName(frequency: string): string {
    return this.frequencies.find(f => f.value === frequency)?.name || frequency;
  }

  getCategoryName(category: string): string {
    return this.categories.find(c => c.value === category)?.name || category;
  }

  getAccountName(accountId: number): string {
    return this.accounts.find(a => a.id === accountId)?.name || 'Desconocida';
  }

  getFrequencyClass(frequency: string): string {
    switch (frequency) {
      case 'DAILY':
        return 'bg-blue-100 text-blue-800';
      case 'WEEKLY':
        return 'bg-green-100 text-green-800';
      case 'MONTHLY':
        return 'bg-purple-100 text-purple-800';
      default:
        return '';
    }
  }

  editarAutomation(automation: Automation) {
    console.log('Editando automatización:', automation);
    this.isEditMode = true;
    this.modalVisible = true;
    this.idAutomationSeleccionada = automation.id ?? null;
    this.nameAutomation = automation.name || ''; // Cargar el nombre de la automatización
    this.amountAutomation = automation.amount;
    this.frequencyAutomation = automation.frequency;
    this.startDateAutomation = automation.startDate ? new Date(automation.startDate).toISOString().split('T')[0] : '';
    this.accountIdAutomation = automation.accountId;
    this.categoryAutomation = automation.category;
  }

  guardarAutomation() {
    if (!this.nameAutomation || !this.amountAutomation || !this.frequencyAutomation || !this.startDateAutomation || !this.accountIdAutomation || !this.categoryAutomation) {
      this.severity = 'error';
      this.summary = 'Error';
      this.detail = 'Todos los campos obligatorios deben estar completos.';
      return;
    }

    const automation: Automation = {
      id: this.idAutomationSeleccionada ?? undefined,
      name: this.nameAutomation,  // Incluir el nombre
      amount: this.amountAutomation,
      frequency: this.frequencyAutomation as 'DAILY' | 'WEEKLY' | 'MONTHLY',
      startDate: this.startDateAutomation, 
      accountId: this.accountIdAutomation,
      category: this.categoryAutomation
    };

    console.log('Guardando automatización:', automation, 'isEditMode:', this.isEditMode);

    if (this.isEditMode && this.idAutomationSeleccionada !== null) {
      this.automationService.update(automation).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          console.log('Automatización actualizada:', res);
          this.severity = 'success';
          this.summary = 'Automatización actualizada';
          this.detail = 'La automatización ha sido actualizada con éxito.';
          this.obtenerAutomations();
          this.resetForm();
          this.modalVisible = false;
        },
        error: (err) => {
          console.error('Error al actualizar automatización:', err);
          this.severity = 'error';
          this.summary = 'Error';
          this.detail = err.error?.message || 'No se pudo actualizar la automatización. Inténtelo nuevamente.';
        }
      });
    } else {
      this.automationService.create(automation).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          console.log('Automatización creada:', res);
          this.severity = 'success';
          this.summary = 'Automatización creada';
          this.detail = 'La automatización ha sido creada con éxito.';
          this.obtenerAutomations();
          this.resetForm();
          this.modalVisible = false;
        },
        error: (err) => {
          console.error('Error al crear automatización:', err);
          this.severity = 'error';
          this.summary = 'Error';
          this.detail = err.error?.message || 'No se pudo crear la automatización. Inténtelo nuevamente.';
        }
      });
    }
  }

  confirmarEliminacion(automation: Automation) {
    this.automationToDelete = automation;
    this.confirmModalVisible = true;
    this.severity = 'warn';
    this.summary = 'Confirmar Eliminación';
    this.detail = `¿Está seguro que desea eliminar la automatización con nombre ${automation.name}?`;
  }

  eliminarAutomation() {
    if (this.automationToDelete && this.automationToDelete.id) {
      this.automationService.delete(this.automationToDelete.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.severity = 'success';
          this.summary = 'Automatización eliminada';
          this.detail = 'La automatización ha sido eliminada con éxito.';
          this.obtenerAutomations();
          this.cerrarConfirmacion();
        },
        error: (err) => {
          console.error('Error al eliminar automatización:', err);
          this.severity = 'error';
          this.summary = 'Error';
          this.detail = err.error?.message || 'No se pudo eliminar la automatización. Inténtelo nuevamente.';
          this.cerrarConfirmacion();
        }
      });
    }
  }

  cerrarConfirmacion() {
    this.confirmModalVisible = false;
    this.automationToDelete = null;
  }

  cancelar() {
    this.modalVisible = false;
    this.resetForm();
  }

  resetForm() {
    this.idAutomationSeleccionada = null;
    this.nameAutomation = '';  // Resetear el nombre
    this.amountAutomation = 0;
    this.frequencyAutomation = '';
    this.startDateAutomation = '';
    this.accountIdAutomation = null;
    this.categoryAutomation = '';
    this.isEditMode = false;
    this.filtroFrecuencia = '';
    this.filtroCategoria = '';
  }
}
