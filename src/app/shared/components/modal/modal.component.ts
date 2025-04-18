import { Component, EventEmitter, Input, Output} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
@Component({
  selector: 'app-modal',
  imports: [DialogModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  @Input() header?: string;
  @Input() width!: string;
  @Input() visible!: boolean;

  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    // Notifica al padre que el modal se ocultó
    this.visibleChange.emit(false);
    console.log('ModalComponent -> onHide, visible false');
  }
}
