import { Component, Input} from '@angular/core';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-select',
  imports: [SelectModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {
@Input() options !: any[] ;
@Input() selectedOption !: string;
@Input() placeholder !: string;
@Input() checkmark !:string;
@Input() showClear !:string;
@Input() optionLabel !: string;

}
