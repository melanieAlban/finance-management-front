import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '../../../services/transaction.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

interface Transaction {
  id: number;
  amount: number;
  type: string; // "Ingreso" o "Gasto"
  date: string; // o Date si lo parseas
  accountId: number;
  category: string; // "COMIDA", "TRANSPORTE", etc.
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

  // Para los modales
  mostrarModal: boolean = false;
  transaccionesModal: Transaction[] = [];
  tituloModal: string = '';

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getAll().subscribe(data => {
      this.transacciones = data;
      this.agruparTransacciones();
    });
  }

  agruparTransacciones(): void {
    const ingresosMap = new Map<string, number>();
    const gastosMap = new Map<string, number>();

    this.transacciones.forEach(tx => {
      if (tx.type === 'Ingreso') {
        ingresosMap.set(tx.category, (ingresosMap.get(tx.category) || 0) + tx.amount);
        this.totalIngresos += tx.amount; // Sumar al total de ingresos
      } else if (tx.type === 'Gasto') {
        gastosMap.set(tx.category, (gastosMap.get(tx.category) || 0) + tx.amount);
        this.totalGastos += tx.amount; // Sumar al total de gastos
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
