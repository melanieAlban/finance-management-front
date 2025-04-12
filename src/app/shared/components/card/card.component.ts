import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-card',
  imports: [CardModule,CommonModule,ButtonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() styleClass?: string;
  @Input() header?: string;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() footer?: string;
}
