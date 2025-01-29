// src/app/loading.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from './services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingGuard implements CanActivate {

  constructor(private loadingService: LoadingService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    this.loadingService.show();
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadingService.hide();
        resolve(true);
      }, 800);
    });
  }
}
