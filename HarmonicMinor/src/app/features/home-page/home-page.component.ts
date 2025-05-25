import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest, map, take, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { table } from 'node:console';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  instruments: any[] = [];
  loading: boolean = true;


  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    console.log('Antes de combineLatest');
    combineLatest([
      this.productService.getGuitarInstruments().pipe(take(1)),
      this.productService.getBassInstruments().pipe(take(1)),
      this.productService.getDrumInstruments().pipe(take(1)),
      this.productService.getPianoInstruments().pipe(take(1)),
      this.productService.getDjInstruments().pipe(take(1)),
      this.productService.getMicrophoneInstruments().pipe(take(1)),
      this.productService.getWindInstruments().pipe(take(1)),
      this.productService.getSoftwareInstruments().pipe(take(1))
    ]).pipe(
      timeout(10000),
      map(results => {
        const categories = [
          'Guitars', 'Basses', 'Drums', 'Pianos',
          'Djs', 'Microphones', 'Winds', 'Softwares'
        ];
        const all = results.flatMap((arr, index) =>
          arr.map((inst: any) => ({ ...inst, category: categories[index] }))
        );

        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [all[i], all[j]] = [all[j], all[i]];
        }

        return all.slice(0, 12);
      })
    ).subscribe({
      next: (instruments) => {
        console.log('SSR instruments loaded', instruments);
        this.instruments = instruments;
        this.loading = false;
      },
      error: (err) => {
        this.instruments = [];
        this.loading = false;
      }
    })

  }

  priceToNumber(price: any): number | null {
    if (!price) return null;

    if (typeof price === 'number') return price;

    const cleaned = price.replace(/[^\d.]/g, '');
    return cleaned ? parseFloat(cleaned) : null;
  }

  goToProduct(instrument: any) {
    this.router.navigate(['/category', instrument.category, instrument.id]);
  }
}
