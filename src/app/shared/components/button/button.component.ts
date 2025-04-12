import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  imports: [ButtonModule, CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
@Input() label!: string;
@Input() icon!: string;
@Input() type!: string;
@Input() color!: string;
@Input() raised!: string
}
