import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';
import { AccesslistComponent } from './accesslist/accesslist.component';

import { LoginGuard } from './services/guards/login-guard.guard';



const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'accesslist',
        component: AccesslistComponent,
        canActivate: [LoginGuard]
    },
    { path: '**', component: LoginComponent }
];


export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );
