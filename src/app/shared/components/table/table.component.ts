import { Component, Input } from '@angular/core';
import { MetaDataColumn } from '../../interfaces/metadatacolumn.interface';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-table',
  imports: [TableModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() data !: any;
  @Input() metadataColumns !: MetaDataColumn[];
  @Input() paginator !: string;
  @Input() rows !: number;
  @Input() rowsPerPageOptions !: number[];
  @Input() color !: string;
}
