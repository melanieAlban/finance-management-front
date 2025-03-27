import { Component, Input } from '@angular/core';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { FormGroup } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  imports: [
    CustomInputComponent,
    CardModule, CommonModule,ButtonModule

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  User!: string;
  Password!: string;

  isLogin: boolean = true;
  isLoginActive: boolean = true; // Estado inicial en Login

  toggleForm() {
    this.isLoginActive = !this.isLoginActive;
    console.log('Estado de isLoginActive:', this.isLoginActive);
  }

  // Métodos para mostrar el formulario de login o registro
  showLogin() {
    this.isLogin = true;
  }

  showRegister() {
    this.isLogin = false;
  }

  onUserInputChange(value: string) {
    console.log('Valor de usuario:', value);
  }

  onPasswordInputChange(value: string) {
    console.log('Valor de contraseña:', value);
  }

  onLogin() {
    console.log('Iniciar sesión con:', this.User, this.Password);
  }
  onRegister() {
    console.log('Registrarse con:', this.User, this.Password);
  }

}



