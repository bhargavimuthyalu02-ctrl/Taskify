import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('taskify_token');
  if (token) return true;
  // Redirect to login if not authenticated
  window.alert('Please login to access tasks.');
  const router = new Router();
  router.navigate(['/login']);
  return false;
};