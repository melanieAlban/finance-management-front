import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Transaction {
  id: number;
  amount: number;
  type: string; 
  date: string; 
  accountId: number;
  category: string; 
  userId: number;
  description: string;
}

@Component({
  selector: 'app-list-transactions',
  standalone: true,
  imports: [CardModule, CommonModule, AvatarModule, DialogModule, ButtonModule],
  templateUrl: './list-transactions.component.html',
  styleUrls: ['./list-transactions.component.css']
})
export class ListTransactionsComponent implements OnInit {
  transacciones: Transaction[] = [];
  ingresos: { category: string; totalAmount: number }[] = [];
  gastos: { category: string; totalAmount: number }[] = [];
  totalIngresos: number = 0;
  totalGastos: number = 0;

  private destroy$ = new Subject<void>();
  mostrarModal: boolean = false;
  transaccionesModal: Transaction[] = [];
  tituloModal: string = '';

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.obternerTransacciones();
    this.transactionService.transactionsUpdated$
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.obternerTransacciones(); 
          });
  }

  obternerTransacciones() {
    this.transactionService.getAll().subscribe(data => {
      this.transacciones = data;
      this.agruparTransacciones();
    });
  }

  agruparTransacciones(): void {
    // Reiniciar los totales antes de cada nueva actualización
    this.totalIngresos = 0;
    this.totalGastos = 0;
  
    const ingresosMap = new Map<string, number>();
    const gastosMap = new Map<string, number>();
  
    this.transacciones.forEach(tx => {
      if (tx.type === 'Ingreso') {
        ingresosMap.set(tx.category, (ingresosMap.get(tx.category) || 0) + tx.amount);
        this.totalIngresos += tx.amount; 
      } else if (tx.type === 'Gasto') {
        gastosMap.set(tx.category, (gastosMap.get(tx.category) || 0) + tx.amount);
        this.totalGastos += tx.amount; 
      }
    });
  
    this.ingresos = Array.from(ingresosMap.entries()).map(([category, totalAmount]) => ({ category, totalAmount }));
    this.gastos = Array.from(gastosMap.entries()).map(([category, totalAmount]) => ({ category, totalAmount }));
  }
  

  getIcon(category: string): string {
    const icons: Record<string, string> = {
      COMIDA: 'pi pi-shopping-cart',
      TRANSPORTE: 'pi pi-car',
      SALUD: 'pi pi-heart',
      SUELDO: 'pi pi-wallet',
      VIVIENDA: 'pi pi-home',
      ENTRETENIMIENTO: 'pi pi-video',
      OTROS: 'pi pi-box'
    };
    return icons[category] || 'pi pi-dollar';
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      COMIDA: 'Comida',
      TRANSPORTE: 'Transporte',
      SALUD: 'Salud',
      SUELDO: 'Sueldo',
      VIVIENDA: 'Vivienda',
      ENTRETENIMIENTO: 'Entretenimiento',
      OTROS: 'Otros'
    };
    return labels[category] || category;
  }

  // Abrir modal según categoría y tipo
  verDetallePorCategoria(tipo: string, categoria: string): void {
    this.transaccionesModal = this.transacciones.filter(tx => tx.type === tipo && tx.category === categoria);
    this.tituloModal = `${tipo}s - ${this.getCategoryLabel(categoria)}`;
    this.mostrarModal = true;
  }

  verTodosPorTipo(tipo: string): void {
    this.transaccionesModal = this.transacciones.filter(tx => tx.type === tipo);
    this.tituloModal = `Transacciones ${tipo}s`;
    this.mostrarModal = true;
  }

  verTodas(): void {
    this.transaccionesModal = [...this.transacciones];
    this.tituloModal = 'Todas las transacciones';
    this.mostrarModal = true;
  }
}
