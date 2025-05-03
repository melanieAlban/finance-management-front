import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { MessageDto, MessageService } from '../../../services/message.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: true,
  imports: [CommonModule, ButtonModule, SidebarModule]
})
export class NotificacionesComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  messages: MessageDto[] = [];
  messageService = inject(MessageService);

  ngOnInit() {
    this.messageService.getAll().subscribe((messages) => {
      this.messages = messages;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.messageService.getAll().subscribe((messages) => {
        this.messages = messages;
      });
    }
  } 

  cerrarNotificaciones() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  getIcono(tipo: string): string {
    switch (tipo) {
      case 'ERROR':
        return 'pi pi-check-circle';
      case 'INFO':
        return 'pi pi-info-circle';
      case 'WARNING':
        return 'pi pi-exclamation-triangle';
      default:
        return 'pi pi-bell';
    }
  }

  getColor(tipo: string): string {
    switch (tipo) {
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}