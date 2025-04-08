import { Component, Input , ViewChild} from '@angular/core';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ToastNotificationComponent } from '../../../shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-login',
  imports: [
    CustomInputComponent,
    CardModule, CommonModule, ButtonModule, ReactiveFormsModule,
    ToastNotificationComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  registerForm!: FormGroup;

  @ViewChild(ToastNotificationComponent) toastNotification!: ToastNotificationComponent;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email],Validators.pattern(/^[A-Za-z]+$/)],
      password: ['', [Validators.required]]
    });
    
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],  
    });
  }
  

  //isLogin: boolean = true;
  isLoginActive: boolean = true; 

  toggleForm() {
    this.isLoginActive = !this.isLoginActive;
    console.log('Estado de isLoginActive:', this.isLoginActive);
  }

  mostrarDAtos(){
    console.log('Datos del formulario de login:', this.registerForm.value);
  }
  

  private showToast(severity: string, summary: string, detail: string) {
    if (this.toastNotification) {
      this.toastNotification.severity = severity;
      this.toastNotification.summary = summary;
      this.toastNotification.detail = detail;
      this.toastNotification.showToast();
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response: { token: string }) => {
          console.log('Login exitoso:', response);
          localStorage.setItem('token', response.token);
          console.log('Formulario valido');
          this.showToast('success', 'Login Exitoso', 'Has iniciado sesión correctamente.');
        },
        error: (err: any) => {
          console.error('Error de login:', err);
          this.showToast('error', 'Login Fallido', 'No se ha podido iniciar sesión');
        }
      });
    } else {
      console.log('Formulario inválido');
      this.showToast('warn', 'Formulario Inválido', 'Por favor, verifica los campos.');
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: (response: any) => {
          console.log('Registro exitoso:', response);
          this.registerForm.reset();
          this.showToast('success', 'Registro Exitoso', 'Se ha creado tu cuenta con éxito');
        },
        error: (err: any) => {
          console.error('Error de registro:', err);
          this.showToast('error', 'Registro Fallido', 'No se ha podido crear tu cuenta.');
        }
      });
    } else {
      console.log('Formulario inválido');
      this.showToast('warn', 'Formulario Inválido', 'Por favor, verifica que todos los campos sean correctos.');
    }
  }
}