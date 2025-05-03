import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { CardModule } from 'primeng/card';
import { AccountService } from '../../../services/account.service';
import { ReportService } from '../../../services/report.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { Select } from 'primeng/select';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';
import { StepsModule } from 'primeng/steps';
import { TimelineModule } from 'primeng/timeline';
import { InputNumberModule } from 'primeng/inputnumber';
interface TypeInterface {
  name: string;
  value: string;
}
@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselModule, CardModule, ModalComponent,
    Select, CustomInputComponent, ButtonComponent, FormsModule, StepsModule, TimelineModule,InputNumberModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  cuentaService = inject(AccountService);
  reportService = inject(ReportService);
  cuentas: any[] = [];
  cuentasWithAddButton: any[] = [];
  totalCuentas: number = 0;
  totalIngresos: number = 0;
  totalGastos: number = 0;
  modalVisible = false;
  nombreCuenta = '';
  tipoCuenta = '';
  balanceCuenta: number | null = null;
  isEditMode = false;
  carouselResponsiveOptions: any[] | undefined;

  tipos: TypeInterface[] = [
    { name: 'Tarjeta de crédito', value: 'CREDIT_CARD' },
    { name: 'Tarjeta de débito', value: 'DEBIT_CARD' },
    { name: 'Cuenta bancaria', value: 'BANK_ACCOUNT' },
    { name: 'Efectivo', value: 'CASH' }
  ];
  ngOnInit() {
    this.cuentaService.getAll().subscribe((res) => {
      this.cuentas = res;
      this.cuentasWithAddButton = [...this.cuentas, { isAddButton: true }];
    });

    this.reportService.getReport().subscribe((report) => {
      this.totalCuentas = report.accounts;
      this.totalIngresos = report.incomes;
      this.totalGastos = report.expenses;
    });

    this.carouselResponsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '771px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '595px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    this.carouselResponsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '771px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '595px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  abrirModal() {
    this.isEditMode = false;
    this.nombreCuenta = '';
    this.tipoCuenta = '';
    this.balanceCuenta = null;
    this.modalVisible = true;
  }

  cancelar() {
    this.modalVisible = false;
  }

  guardarCuenta() {
    const nuevaCuenta = {
      name: this.nombreCuenta,
      type: this.tipoCuenta,
      balance: this.balanceCuenta
    };

    this.cuentaService.create(nuevaCuenta).subscribe(() => {
      this.modalVisible = false;
      this.ngOnInit();
    });


  }
  getTipoClass(tipo: string): string {
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

}
