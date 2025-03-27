import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./custom-input.component.css']
})
export class CustomInputComponent {
  @Input() label!: string; // Etiqueta para el input
  @Input() type: string = 'text'; // Tipo del input (text o password)
  @Input() icon!: string; // Icono para el input (ejemplo: 'pi pi-user' o 'pi pi-lock')
  @Input() placeholder!: string; // Placeholder para el input
  @Output() valueChange = new EventEmitter<string>(); // Emite el valor del input
  @Input() value!: string; // Valor del input

  // Método para capturar el cambio de valor del input
  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement; // Casting explícito para acceder a 'value'
    this.valueChange.emit(inputElement.value); // Emitir el valor del input
  }
}
