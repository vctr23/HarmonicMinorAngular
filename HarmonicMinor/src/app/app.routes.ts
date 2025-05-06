import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { InitialPageComponent } from './initial-page/initial-page.component';

export const routes: Routes = [
    { path: '', component: InitialPageComponent },
    { path: 'home', component: HomePageComponent },
];
