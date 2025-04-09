import { Component, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
// import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [Toast, ButtonModule],  
  providers: [MessageService],  // Proporciona MessageService aquí
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.css']
})
export class ToastNotificationComponent {

  @Input() severity!: string;
  @Input() summary!: string;
  @Input() detail!: string;

  constructor(private messageService: MessageService) { }

  showToast() {
    this.messageService.add({ severity: this.severity, summary: this.summary, detail: this.detail,life:3000 });
  }
}
