import { Routes } from '@angular/router';
import { MainComponent } from './core/components/main/main.component';
import { LoginComponent } from './core/components/login/login.component';

export const routes: Routes = [
    {path:"",component:LoginComponent},
    {path:"main",component:MainComponent,
        

    }
    
];
