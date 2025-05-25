import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home-page/home-page.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { LoginPageComponent } from './features/auth/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/register-page/register-page.component';
import { MenuPageComponent } from './features/menu-page/menu-page.component';
import { authGuard } from './core/guards/auth.guard';
import { RecoverPasswordComponent } from './features/auth/recover-password/recover-password.component';
import { TermsPageComponent } from './features/terms-page/terms-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { FAQsPageComponent } from './features/faqs-page/faqs-page.component';
import { AboutUsPageComponent } from './features/about-us-page/about-us-page.component';
import { CategoryPageComponent } from './features/category-page/category-page.component';
import { InstrumentPageComponent } from './features/instrument-page/instrument-page.component';
import { FavouritesPageComponent } from './features/favourites-page/favourites-page.component';
import { ShoppingCartPageComponent } from './features/shopping-cart-page/shopping-cart-page.component';
import { OrderConfirmationComponent } from './features/order-confirmation/order-confirmation.component';
import path from 'path';
import { SearchResultsComponent } from './shared/components/search-results/search-results.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'home', component: HomePageComponent },
    { path: 'signin', component: LoginPageComponent },
    { path: 'signup', component: RegisterPageComponent },
    { path: 'profile', component: MenuPageComponent, canActivate: [authGuard]},
    { path: 'password-recovery', component: RecoverPasswordComponent, canActivate: [authGuard]},
    { path: 'terms', component: TermsPageComponent },
    { path: 'faqs', component: FAQsPageComponent },
    { path: 'about-us', component: AboutUsPageComponent },
    { path: 'category/:categoryName', component: CategoryPageComponent },
    { path: 'category/:categoryName/:instrumentId', component: InstrumentPageComponent },
    { path: 'favourites', component: FavouritesPageComponent, canActivate: [authGuard]},
    { path: 'cart', component: ShoppingCartPageComponent, canActivate: [authGuard]},
    { path: 'order-confirmation', component: OrderConfirmationComponent },
    { path: 'search', component: SearchResultsComponent},
    { path: '**', component: NotFoundPageComponent }
];
