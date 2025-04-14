import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges} from '@angular/core';
import { ControlValueAccessor, FormsModule,NG_VALUE_ACCESSOR, } from '@angular/forms';
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-select',
  imports: [SelectModule, CommonModule,FormsModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements ControlValueAccessor {
@Input() options !: any[] ;
@Input() selectedOption !: string;
@Input() placeholder !: string;
@Input() checkmark !:string;
@Input() showClear !:string;
@Input() optionLabel !: string;
@Input() optionValue !: string;

value: any;

  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implementar si necesitas manejar deshabilitado
  }

  onModelChange(event: any) {
    this.value = event;
    this.onChange(event);
  }
}
