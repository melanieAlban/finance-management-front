import { Component,Input ,inject,OnChanges,SimpleChanges} from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-toast',
  imports: [ToastModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  providers: [MessageService]
})
export class ToastComponent  implements OnChanges{
  @Input() severity !: string;
  @Input() summary !: string ;
  @Input() detail !: string ;

  toast=inject(MessageService);
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['severity'] || changes['summary'] || changes['detail']) {
      this.toast.add({
        severity: this.severity,
        summary: this.summary,
        detail: this.detail,
        life: 3000
      });
    }
  }
}
