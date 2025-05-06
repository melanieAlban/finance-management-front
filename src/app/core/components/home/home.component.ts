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
import { TransactionService } from '../../../services/transaction.service';
import { TransactionComponent } from '../../../shared/components/transaction/transaction.component';
import { ChartModule } from 'primeng/chart';
import { Subject, takeUntil } from 'rxjs';
interface TypeInterface {
  name: string;
  value: string;
}
@Component({
  selector: 'app-home',
  imports: [CommonModule, CarouselModule, CardModule, ModalComponent,
    Select, CustomInputComponent, ButtonComponent, FormsModule, StepsModule, TimelineModule, InputNumberModule, TransactionComponent, ChartModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private destroy$ = new Subject<void>()
  cuentaService = inject(AccountService);
  transactionService = inject(TransactionService);
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
  transactions: any[] = [];

  tipos: TypeInterface[] = [
    { name: 'Tarjeta de crédito', value: 'CREDIT_CARD' },
    { name: 'Tarjeta de débito', value: 'DEBIT_CARD' },
    { name: 'Cuenta bancaria', value: 'BANK_ACCOUNT' },
    { name: 'Efectivo', value: 'CASH' }
  ];
  getTypeName(tipo: string): string {
    return this.tipos.find(t => t.value === tipo)?.name!;
  }

  ngOnInit() {
    this.cargarDatos()

    this.reportService.getReport().subscribe((report) => {
      this.totalCuentas = report.accounts;
      this.totalIngresos = report.incomes;
      this.totalGastos = report.expenses;
    });

    this.transactionService.transactionsUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cargarDatos())

    this.carouselResponsiveOptions = [
      {
        breakpoint: '1675px',
        numVisible: 5,
        numScroll: 1,
      },
      {
        breakpoint: '1400px',
        numVisible: 4,
        numScroll: 1,
      },
      {
        breakpoint: '1190px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '944px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '706px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

  }

  private cargarDatos() {
    this.transactionService.getAll().subscribe(res => {
      this.transactions = res.slice(0, 5)
      this.prepareChartData()
    })
    this.reportService.getReport().subscribe(r => {
      this.totalIngresos = r.incomes
      this.totalGastos = r.expenses
    })
    this.cuentaService.getAll().subscribe(res => {
      this.cuentas = res;
      this.cuentasWithAddButton = [...this.cuentas, { isAddButton: true }];
    });
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

  chartData: any;
  chartOptions: any;

  prepareChartData() {
    const ingresosMap = new Map<string, number>();
    const gastosMap = new Map<string, number>();

    this.transactions.forEach(t => {
      const date = t.date;
      const amount = parseFloat(t.amount);
      if (t.type === 'Ingreso') {
        ingresosMap.set(date, (ingresosMap.get(date) || 0) + amount);
      } else if (t.type === 'Gasto') {
        gastosMap.set(date, (gastosMap.get(date) || 0) + amount);
      }
    });

    const allDates = Array.from(new Set([...ingresosMap.keys(), ...gastosMap.keys()])).sort();

    this.chartData = {
      labels: allDates,
      datasets: [
        {
          label: 'Gastos',
          data: allDates.map(date => gastosMap.get(date) || 0),
          borderColor: '#ef4444', // rojo
          tension: 0.4,
          fill: false
        },
        {
          label: 'Ingresos',
          data: allDates.map(date => ingresosMap.get(date) || 0),
          borderColor: '#22c55e',
          tension: 0.4,
          fill: false
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fecha'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Monto ($)'
          },
          beginAtZero: true
        }
      }
    };
  }


}
