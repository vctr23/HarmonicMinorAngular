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
  originalOrder: any[] = [];
  loading: boolean = true;

  viewMode: 'grid' | 'list' = 'grid';
  sortOption: string = 'default';
  page: number = 1;
  pageSize: number = 10;

  constructor(private userService: UserService, private productService: ProductService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userService.getFavourites().subscribe(user => {
          const favourites = user?.['favorites'] || [];
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
            this.originalOrder = [...this.favouriteProducts];
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

  removeAllFavourites() {
    this.loading = true;
    const removes = this.favouriteProducts.map(product =>
      this.userService.removeFromFavourites(product.category, product.id)
    );
    Promise.all(removes).then(() => {
      this.ngOnInit();
    });
  }

  goToProduct(instrument: any) {
    this.router.navigate(['/category', instrument.category, instrument.id]);
  }

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  sortFavourites() {
    if (this.sortOption === 'default') {
      this.favouriteProducts = [...this.originalOrder];
    } else if (this.sortOption === 'price-asc') {
      this.favouriteProducts = [...this.originalOrder].sort((a, b) =>
        (this.priceToNumber(a.price) ?? 0) - (this.priceToNumber(b.price) ?? 0));
    } else if (this.sortOption === 'price-desc') {
      this.favouriteProducts = [...this.originalOrder].sort((a, b) =>
        (this.priceToNumber(b.price) ?? 0) - (this.priceToNumber(a.price) ?? 0)
      );
    } else if (this.sortOption === 'name-asc') {
      this.favouriteProducts = [...this.originalOrder].sort((a, b) =>
        a.name.localeCompare(b.name));
    } else if (this.sortOption === 'name-desc') {
      this.favouriteProducts = [...this.originalOrder].sort((a, b) =>
        b.name.localeCompare(a.name));
    }
  }

  addToCart(category: string, id: string, event: Event) {
    event.stopPropagation();
    this.userService.addToCart(category, id);
  }

  priceToNumber(price: any): number | null {
    if (!price) return null;

    if (typeof price === 'number') return price;

    const cleaned = price.replace(/[^\d.]/g, '');
    return cleaned ? parseFloat(cleaned) : null;
  }

  get totalPages(): number {
    return Math.ceil(this.favouriteProducts.length / this.pageSize);
  }

  get paginatedProducts(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.favouriteProducts.slice(start, start + this.pageSize);
  }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages) {
      this.page = p;
    }
  }
}
