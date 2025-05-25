import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-results',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  query: string = '';
  loading = true;
  results: any[] = [];

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      this.query = (params['q'] || '').toLowerCase().trim();
      this.loading = true;
      this.results = [];

      if (!this.query) {
        this.loading = false;
        return;
      }

      // Buscar en todas las categorías
      const categoryMethods: { [key: string]: () => any } = {
        Guitars: () => this.productService.getGuitarInstruments(),
        Basses: () => this.productService.getBassInstruments(),
        Drums: () => this.productService.getDrumInstruments(),
        Pianos: () => this.productService.getPianoInstruments(),
        Djs: () => this.productService.getDjInstruments(),
        Microphones: () => this.productService.getMicrophoneInstruments(),
        Winds: () => this.productService.getWindInstruments(),
        Softwares: () => this.productService.getSoftwareInstruments()
      };

      const categories = Object.keys(categoryMethods);

      const requests = categories.map(cat =>
        firstValueFrom(categoryMethods[cat]()).then(products =>
          (products as any[]).map((p: any) => ({ ...p, category: cat }))
        )
      );
      
      const allProducts = (await Promise.all(requests)).flat();

      this.results = allProducts.filter(product => {
        const p = product as { name?: string; manufacturer?: string };
        return (
          (p.name && p.name.toLowerCase().includes(this.query)) ||
          (p.manufacturer && p.manufacturer.toLowerCase().includes(this.query))
        );
      });

      this.loading = false;
    });
  }

  priceToNumber(price: any): number | null {
    if (!price) return null;
    if (typeof price === 'number') return price;
    const cleaned = price.replace(/[^\d.]/g, '');
    return cleaned ? parseFloat(cleaned) : null;
  }
}
