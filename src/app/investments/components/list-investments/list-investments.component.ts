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
import { ProgressBarModule } from 'primeng/progressbar';
import { InvestmentService, Investment } from '../../../services/investement.service';

interface ProgressFilter {
  name: string;
  value: string;
}

@Component({
  selector: 'app-list-investments',
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CustomInputComponent,
    CardComponent,
    ModalComponent,
    ToastComponent,
    SelectModule,
    ProgressBarModule
  ],
  templateUrl: './list-investments.component.html',
  styleUrls: ['./list-investments.component.css'],
  standalone: true
})
export class ListInvestmentsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  investments: Investment[] = [];
  modalVisible: boolean = false;
  confirmModalVisible: boolean = false;
  isEditMode: boolean = false;
  idInvestmentSeleccionada: number | null = null;
  nameInvestment: string = '';
  initialAmountInvestment: number = 0;
  returnRateInvestment: number = 0;
  startDateInvestment: string = '';
  endDateInvestment: string = '';
  progressInvestment: number = 0;
  filtroProgreso: string = '';
  severity: string = '';
  summary: string = '';
  detail: string = '';
  confirmMessage: string = '';
  investmentToDelete: Investment | null = null;

  investmentService = inject(InvestmentService);

  progressFilters: ProgressFilter[] = [
    { name: 'Menos del 25%', value: 'LESS_25' },
    { name: '25% - 50%', value: '25_50' },
    { name: '50% - 75%', value: '50_75' },
    { name: 'Más del 75%', value: 'MORE_75' }
  ];

  constructor() {}

  ngOnInit(): void {
    this.obtenerInvestments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  calcularGanancia(initialAmount: number, returnRate: number, progress: number): number {
    const gananciaPotencial = initialAmount * (returnRate / 100);
    const gananciaActual = gananciaPotencial * (progress / 100);
    return Number(gananciaActual.toFixed(2));
  }
  get gananciaActual(): number {
    return this.calcularGanancia(
      this.initialAmountInvestment,
      this.returnRateInvestment,
      this.progressInvestment
    );
  }
  obtenerInvestments() {
    this.investmentService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        console.log('Inversiones recibidas:', res);
        this.investments = res;
      },
      error: (err) => {
        console.error('Error al obtener inversiones:', err);
        this.severity = 'error';
        this.summary = 'Error';
        this.detail = 'No se pudieron cargar las inversiones. Inténtelo nuevamente.';
      }
    });
  }

  get investmentsFiltradas() {
    let filtered = this.investments;
    if (this.filtroProgreso) {
      filtered = filtered.filter(investment => {
        switch (this.filtroProgreso) {
          case 'LESS_25':
            return investment.progress < 25;
          case '25_50':
            return investment.progress >= 25 && investment.progress < 50;
          case '50_75':
            return investment.progress >= 50 && investment.progress < 75;
          case 'MORE_75':
            return investment.progress >= 75;
          default:
            return true;
        }
      });
    }
    return filtered;
  }

  editarInvestment(investment: Investment) {
    console.log('Editando inversión:', investment);
    this.isEditMode = true;
    this.modalVisible = true;
    this.idInvestmentSeleccionada = investment.id ?? null;
    this.nameInvestment = investment.name;
    this.initialAmountInvestment = investment.initialAmount;
    this.returnRateInvestment = investment.returnRate;
    this.startDateInvestment = investment.startDate ? new Date(investment.startDate).toISOString().split('T')[0] : '';
    this.endDateInvestment = investment.endDate ? new Date(investment.endDate).toISOString().split('T')[0] : '';
    this.progressInvestment = investment.progress;
  }

  guardarInvestment() {
    // Validar todos los campos obligatorios
    if (!this.nameInvestment.trim()) {
      this.severity = 'error';
      this.summary = 'Error';
      this.detail = 'El nombre es obligatorio.';
      return;
    }
    if (this.initialAmountInvestment <= 0) {
      this.severity = 'error';
      this.summary = 'Error';
      this.detail = 'El monto inicial debe ser mayor a 0.';
      return;
    }
    if (this.returnRateInvestment < 0) {
      this.severity = 'error';
      this.summary = 'Error';
      this.detail = 'La tasa de retorno no puede ser negativa.';
      return;
    }
    if (!this.startDateInvestment) {
      this.severity = 'error';
      this.summary = 'Error';
      this.detail = 'La fecha de inicio es obligatoria.';
      return;
    }
    if (!this.endDateInvestment) {
      this.severity = 'error';
      this.summary = 'Error';
      this.detail = 'La fecha de fin es obligatoria.';
      return;
    }
    if (this.progressInvestment < 0 || this.progressInvestment > 100) {
      this.severity = 'error';
      this.summary = 'Error';
      this.detail = 'El progreso debe estar entre 0 y 100.';
      return;
    }


    const investment: Investment = {
      id: this.idInvestmentSeleccionada ?? undefined,
      name: this.nameInvestment.trim(),
      initialAmount: this.initialAmountInvestment,
      returnRate: this.returnRateInvestment,
      startDate: this.startDateInvestment,
      endDate: this.endDateInvestment,
      progress: this.progressInvestment
    };

    console.log('Guardando inversión:', investment, 'isEditMode:', this.isEditMode);

    if (this.isEditMode && this.idInvestmentSeleccionada !== null) {
      this.investmentService.update(investment).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          console.log('Inversión actualizada:', res);
          this.severity = 'success';
          this.summary = 'Inversión actualizada';
          this.detail = 'La inversión ha sido actualizada con éxito.';
          this.obtenerInvestments();
          this.resetForm();
          this.modalVisible = false;
        },
        error: (err) => {
          console.error('Error al actualizar inversión:', err);
          this.severity = 'error';
          this.summary = 'Error';
          this.detail = err.error?.message || 'No se pudo actualizar la inversión. Inténtelo nuevamente.';
        }
      });
    } else {
      this.investmentService.create(investment).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          console.log('Inversión creada:', res);
          this.severity = 'success';
          this.summary = 'Inversión creada';
          this.detail = 'La inversión ha sido creada con éxito.';
          this.obtenerInvestments();
          this.resetForm();
          this.modalVisible = false;
        },
        error: (err) => {
          console.error('Error al crear inversión:', err);
          this.severity = 'error';
          this.summary = 'Error';
          this.detail = err.error?.message || 'No se pudo crear la inversión. Inténtelo nuevamente.';
        }
      });
    }
  }

  confirmarEliminacion(investment: Investment) {
    this.investmentToDelete = investment;
    this.confirmModalVisible = true;
    this.confirmMessage = `¿Está seguro que desea eliminar la inversión con nombre ${investment.name}?`;
    this.severity = '';
    this.summary = '';
    this.detail = '';
  }

  eliminarInvestment() {
    if (this.investmentToDelete && this.investmentToDelete.id) {
      this.investmentService.delete(this.investmentToDelete.id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.severity = 'success';
          this.summary = 'Inversión eliminada';
          this.detail = 'La inversión ha sido eliminada con éxito.';
          this.obtenerInvestments();
          this.cerrarConfirmacion();
        },
        error: (err) => {
          console.error('Error al eliminar inversión:', err);
          this.severity = 'error';
          this.summary = 'Error';
          this.detail = err.error?.message || 'No se pudo eliminar la inversión. Inténtelo nuevamente.';
          this.cerrarConfirmacion();
        }
      });
    }
  }

  cerrarConfirmacion() {
    this.confirmModalVisible = false;
    this.investmentToDelete = null;
    this.confirmMessage = '';
  }

  cancelar() {
    this.modalVisible = false;
    this.resetForm();
  }

  resetForm() {
    this.idInvestmentSeleccionada = null;
    this.nameInvestment = '';
    this.initialAmountInvestment = 0;
    this.returnRateInvestment = 0;
    this.startDateInvestment = '';
    this.endDateInvestment = '';
    this.progressInvestment = 0;
    this.isEditMode = false;
    this.filtroProgreso = '';
  }
}