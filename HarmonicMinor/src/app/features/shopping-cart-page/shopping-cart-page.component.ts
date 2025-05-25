import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-shopping-cart-page',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './shopping-cart-page.component.html',
  styleUrl: './shopping-cart-page.component.css'
})
export class ShoppingCartPageComponent implements OnInit {

  locality: string = '';
  phone: string = '';
  id: string = '';
  country: string = '';
  name: string = '';
  lastname: string = '';
  postcode: string = '';
  street: string = '';
  errorMessageAddress: string = '';

  cartProducts: any[] = [];
  loading: boolean = true;

  constructor(private userService: UserService, private authService: AuthService, private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userService.getCart().subscribe(user => {
          const cart = user?.['cart'] || [];
          const requests: Promise<any>[] = [];

          Object.keys(cart).forEach(category => {
            (cart[category] as string[]).forEach(productId => {
              requests.push(
                firstValueFrom(this.productService.getInstrumentById(productId, category))
                  .then(product => product ? { ...product, category } : null)
              );
            });
          });

          Promise.all(requests).then(products => {
            this.cartProducts = products.filter(Boolean);
            this.loading = false;
          });
        });
      }
    });

    this.userService.getUserAddressData().subscribe({
      next: (userAddressData) => {
        if (userAddressData) {
          this.id = userAddressData.id || '';
          this.country = userAddressData.country || '';
          this.name = userAddressData.name || '';
          this.lastname = userAddressData.lastname || '';
          this.postcode = userAddressData.postcode || '';
          this.street = userAddressData.street || '';
          this.locality = userAddressData.locality || '';
          this.phone = userAddressData.phone || '';
          this.errorMessageAddress = '';
        } else {
          this.errorMessageAddress = 'No address data found';
        }
      },
      error: (err) => {
        this.errorMessageAddress = 'Error while retrieving user address data:' + err;
        this.locality = '';
        this.phone = '';
        this.id = '';
        this.country = '';
        this.name = '';
        this.lastname = '';
        this.postcode = '';
        this.street = '';
      }
    })
  }

  async checkout() {
    this.loading = true;

    if(this.cartProducts.length === 0) {
      this.loading = false;
      alert('Your cart is empty. Please add products before proceeding to checkout.');
      return;
    }

    for (const product of this.cartProducts) {
      const fresh = await firstValueFrom(
        this.productService.getInstrumentById(product.id, product.category)
      );

      if (!fresh || fresh.stock <= 0) {
        this.loading = false;
        alert(`The product ${product.name} is not available at the moment.`);
        return;
      }
    }

    for (const product of this.cartProducts) {
      await this.productService.updateStock(product.id, product.category, -1);
    }

    await this.userService.clearCart();

    this.loading = false;
    this.router.navigate(['/order-confirmation']);
  }

  removeFromCart(category: string, id: string) {
    this.userService.removeFromCart(category, id).then(() => {
      this.loading = true;
      this.ngOnInit();
    });
  }

  removeAllCart() {
    this.loading = true;
    this.userService.clearCart().then(() => {
      this.ngOnInit();
    })
  }

  priceToNumber(price: any): number | null {
    if (!price) return null;

    if (typeof price === 'number') return price;

    const cleaned = price.replace(/[^\d.]/g, '');
    return cleaned ? parseFloat(cleaned) : null;
  }

  getCartTotal(): number {
    return this.cartProducts.reduce((total, product) => {
      const price = this.priceToNumber(product.price);
      return total + (price ?? 0);
    }, 0);
  }

  getTaxes(): number {
    const total = this.getCartTotal();
    const taxes = total * 0.21;
    return Math.round(taxes * 100) / 100;
  }
}
