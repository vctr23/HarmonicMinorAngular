import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-instrument-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './instrument-page.component.html',
  styleUrl: './instrument-page.component.css'
})
export class InstrumentPageComponent implements OnInit {

  @ViewChild('slider', { static: false }) slider!: ElementRef<HTMLDivElement>;
  product: any;
  categoryName: string | null = '';
  loading: boolean = true;
  activeTab: string = 'description';
  relatedProducts: any[] = [];
  favourites: any = {};
  sliderIndex: number = 0;
  sliderVisible = 3

  constructor(private route: ActivatedRoute, private productService: ProductService, private userService: UserService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('instrumentId');
      this.categoryName = params.get('categoryName');
      if (id && this.categoryName) {
        this.loading = true;
        this.productService.getInstrumentById(id, this.categoryName).subscribe(instrument => {
          this.product = instrument;
          this.loading = false;
        })
      }
    });

    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('categoryName');
      if (this.categoryName) {
        switch (this.categoryName) {
          case 'Guitars':
            this.categoryName = 'Guitars';
            this.productService.getGuitarInstruments().subscribe((allGuitars: any[]) => {
              const filtered = allGuitars.filter(inst => inst.id !== this.product.id);
              for (let i = filtered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
              }
              this.relatedProducts = filtered.slice(0, 4);
            });
            break;
          case 'Basses':
            this.categoryName = 'Basses';
            this.productService.getBassInstruments().subscribe((allBasses: any[]) => {
              const filtered = allBasses.filter(inst => inst.id !== this.product.id);
              for (let i = filtered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
              }
              this.relatedProducts = filtered.slice(0, 4);
            });
            break;
          case 'Pianos':
            this.categoryName = 'Pianos';
            this.productService.getPianoInstruments().subscribe((allPianos: any[]) => {
              const filtered = allPianos.filter(inst => inst.id !== this.product.id);
              for (let i = filtered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
              }
              this.relatedProducts = filtered.slice(0, 4);
            });
            break;
          case 'Drums':
            this.categoryName = 'Drums';
            this.productService.getDrumInstruments().subscribe((allDrums: any[]) => {
              const filtered = allDrums.filter(inst => inst.id !== this.product.id);
              for (let i = filtered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
              }
              this.relatedProducts = filtered.slice(0, 4);
            });
            break;
          case 'Winds':
            this.categoryName = 'Winds';
            this.productService.getWindInstruments().subscribe((allWinds: any[]) => {
              const filtered = allWinds.filter(inst => inst.id !== this.product.id);
              for (let i = filtered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
              }
              this.relatedProducts = filtered.slice(0, 4);
            });
            break;
          case 'Djs':
            this.categoryName = 'Djs';
            this.productService.getDjInstruments().subscribe((allDjs: any[]) => {
              const filtered = allDjs.filter(inst => inst.id !== this.product.id);
              for (let i = filtered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
              }
              this.relatedProducts = filtered.slice(0, 4);
            });
            break;
          case 'Softwares':
            this.categoryName = 'Softwares';
            this.productService.getSoftwareInstruments().subscribe((allSoftwares: any[]) => {
              const filtered = allSoftwares.filter(inst => inst.id !== this.product.id);
              for (let i = filtered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
              }
              this.relatedProducts = filtered.slice(0, 4);
            });
            break;
          case 'Microphones':
            this.categoryName = 'Microphones';
            this.productService.getMicrophoneInstruments().subscribe((allMicrophones: any[]) => {
              const filtered = allMicrophones.filter(inst => inst.id !== this.product.id);
              for (let i = filtered.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
              }
              this.relatedProducts = filtered.slice(0, 4);
            });
            break;
          default:
            this.relatedProducts = [];
        }
      }
    });

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userService.getFavourites().subscribe(user => {
          this.favourites = user?.['favorites'] || {};
        });
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  goToProduct(id: string) {
    this.router.navigate(['/category', this.categoryName, id]);
  }

  scrollToIndex() {
    const slider = this.slider.nativeElement;
    const cardWidth = slider.offsetWidth / this.sliderVisible;
    slider.scrollTo({
      left: this.sliderIndex * cardWidth,
      behavior: 'smooth'
    });
  }

  prevRelated() {
    if (this.sliderIndex > 0) {
      this.sliderIndex--;
      this.scrollToIndex();
    }
  }

  nextRelated() {
    if (this.sliderIndex < this.relatedProducts.length - this.sliderVisible) {
      this.sliderIndex++;
      this.scrollToIndex();
    }
  }

  getDescriptionList(description: string): string[] {
    return description
      .split('•')
      .map(item => item.trim())
      .filter(item => item.length > 0);
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

  addToCart(category: string, id: string, event: Event) {
    event.stopPropagation();
    this.userService.addToCart(category, id);
  }
}
