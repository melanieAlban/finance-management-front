import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../interfaces/transaction.interface';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-transaction',
  imports: [CommonModule, DividerModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
  @Input() transaction!: Transaction;
}
