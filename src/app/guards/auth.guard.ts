import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (token !== null) {
    return true;
  }

  return router.createUrlTree(['']);
};