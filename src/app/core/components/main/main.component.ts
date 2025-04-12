import { Component } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';


@Component({
  selector: 'app-main',
  imports: [MenuComponent,RouterOutlet,HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
