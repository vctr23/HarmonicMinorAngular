import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-category-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css'
})
export class CategoryPageComponent implements OnInit {
  categoryName: string = '';
  loading: boolean = true;
  instruments: any[] = [];
  originalOrder: any[] = [];
  favourites: any = {};

  viewMode: 'grid' | 'list' = 'grid';
  sortOption: string = 'relevance';


  constructor(private route: ActivatedRoute, private productService: ProductService, private userService: UserService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('categoryName') || '';
      this.loading = true;
      this.instruments = [];
      this.originalOrder = [];

      switch (this.categoryName) {
        case 'Guitars':
          this.categoryName = 'Guitars';
          this.productService.getGuitarInstruments().subscribe(this.handleInstruments());
          break;
        case 'Basses':
          this.categoryName = 'Basses';
          this.productService.getBassInstruments().subscribe(this.handleInstruments());
          break;
        case 'Pianos':
          this.categoryName = 'Pianos';
          this.productService.getPianoInstruments().subscribe(this.handleInstruments());
          break;
        case 'Drums':
          this.categoryName = 'Drums';
          this.productService.getDrumInstruments().subscribe(this.handleInstruments());
          break;
        case 'Winds':
          this.categoryName = 'Winds';
          this.productService.getWindInstruments().subscribe(this.handleInstruments());
          break;
        case 'Djs':
          this.categoryName = 'Djs';
          this.productService.getDjInstruments().subscribe(this.handleInstruments());
          break;
        case 'Softwares':
          this.categoryName = 'Softwares';
          this.productService.getSoftwareInstruments().subscribe(this.handleInstruments());
          break;
        case 'Microphones':
          this.categoryName = 'Microphones';
          this.productService.getMicrophoneInstruments().subscribe(this.handleInstruments());
          break;
        default:
          this.instruments = [];
          this.loading = false;
      }
    });

    this.userService.getFavourites().subscribe((user: any) => {
      this.favourites = user?.favourites || {};
    });
  }

  private handleInstruments() {
    return {
      next: (instruments: any[]) => {
        this.instruments = instruments;
        this.originalOrder = [...instruments];
        this.loading = false;
        this.sortInstruments();
      },
      error: () => {
        this.instruments = [];
        this.loading = false;
      }
    }
  };

  setViewMode(mode: 'grid' | 'list') {
    this.viewMode = mode;
  }

  sortInstruments() {
    if (this.sortOption === 'relevance') {
      this.instruments = [...this.originalOrder];
    } else if (this.sortOption === 'price-asc') {
      this.instruments = [...this.originalOrder].sort((a, b) =>
        (this.priceToNumber(a.price) ?? 0) - (this.priceToNumber(b.price) ?? 0));
    } else if (this.sortOption === 'price-desc') {
      this.instruments = [...this.originalOrder].sort((a, b) =>
        (this.priceToNumber(b.price) ?? 0) - (this.priceToNumber(a.price) ?? 0)
      );
    }
  }

  priceToNumber(price: any): number | null {
    if (!price) return null;

    if (typeof price === 'number') return price;

    const cleaned = price.replace(/[^\d.]/g, '');
    return cleaned ? parseFloat(cleaned) : null;
  }

  isFavourite(category: string, id: string): boolean {
    return !!this.favourites[category]?.[id];
  }

  toggleFavourite(category: string, id: string, event: Event) {
    event.stopPropagation();
    if (this.isFavourite(category, id)) {
      this.userService.removeFromFavourites(category, id);
    } else {
      this.userService.addToFavourites(category, id);
    }
  }
}
