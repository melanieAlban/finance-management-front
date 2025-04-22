import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
@Component({
  selector: 'app-list-goals',
  imports: [CardModule,ProgressBarModule,ButtonModule,CommonModule],
  templateUrl: './list-goals.component.html',
  styleUrl: './list-goals.component.css'
})
export class ListGoalsComponent {

}
