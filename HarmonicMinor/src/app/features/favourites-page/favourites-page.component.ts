import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { ProductService } from '../../core/services/product.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-favourites-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './favourites-page.component.html',
  styleUrl: './favourites-page.component.css'
})
export class FavouritesPageComponent implements OnInit {

  favouriteProducts: any[] = [];
  loading: boolean = true;
  viewMode: 'grid' | 'list' = 'grid';

  constructor(private userService: UserService, private productService: ProductService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userService.getFavourites().subscribe(user => {
          const favourites = user?.['favourites'] || [];
          const requests: Promise<any>[] = [];

          // Recorrer categorías y productos
          Object.keys(favourites).forEach(category => {
            Object.keys(favourites[category]).forEach(productId => {
              // Llama a tu ProductService para obtener el producto por id y categoría
              requests.push(
                firstValueFrom(this.productService.getInstrumentById(productId, category))
                  .then(product => product ? { ...product, category } : null)
              );
            });
          });

          // Espera a que se resuelvan todas las peticiones
          Promise.all(requests).then(products => {
            this.favouriteProducts = products.filter(Boolean);
            this.loading = false;
          });
        });
      }
    });
  }

  removeFromFavourites(category: string, id: string) {
    this.userService.removeFromFavourites(category, id).then(() => {
      this.loading = true;
      this.ngOnInit();
    });
  }

  goToProduct(instrument: any) {
    this.router.navigate(['/category', instrument.category, instrument.id]);
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }
}
