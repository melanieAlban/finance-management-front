import { Component } from '@angular/core';
import { LoginComponent } from './core/components/login/login.component'; // Asegúrate de que la ruta esté correcta

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent],  // Agrega el componente standalone aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'finance-management-front';
}
