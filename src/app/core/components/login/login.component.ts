import { Component, Input } from '@angular/core';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CustomInputComponent,
    CardModule, CommonModule,ButtonModule, ReactiveFormsModule

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],  
    });
  }
  

  isLogin: boolean = true;
  isLoginActive: boolean = true; // Estado inicial en Login

  toggleForm() {
    this.isLoginActive = !this.isLoginActive;
    console.log('Estado de isLoginActive:', this.isLoginActive);
  }

  mostrarDAtos(){
    console.log('Datos del formulario de login:', this.registerForm.value);
  }
  

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value; // Obtiene email y password del formulario
  
      this.authService.login(credentials).subscribe({
        next: (response: { token: string }) => {
          console.log('Login exitoso:', response);
          localStorage.setItem('token', response.token);
          console.log('Formulario valido');
          
        },
        error: (err: any) => {
          console.error('Error de login:', err);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
  
  onRegister() {
    if(this.registerForm.valid) {
      const userData = this.registerForm.value; // Obtiene los datos del formulario de registro
  
      this.authService.register(userData).subscribe({
        next: (response: any) => {
          console.log('Registro exitoso:', response);
          this.registerForm.reset(); // Resetea el formulario de registro después de un login exitoso
        },
        error: (err: any) => {
          console.error('Error de registro:', err);
        }
      });
    }
    else {
      console.log('Formulario inválido');
    }
  }

}



