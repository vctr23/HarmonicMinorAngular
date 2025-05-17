import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  instruments: any[] = [];
  loading: boolean = true;


  constructor(private userService: UserService) { }

  ngOnInit(): void {
    combineLatest([
      this.userService.getGuitarInstruments(),
      this.userService.getBassInstruments(),
      this.userService.getDrumInstruments(),
      this.userService.getPianoInstruments(),
      this.userService.getDjInstruments(),
      this.userService.getMicrophoneInstruments(),
      this.userService.getWindInstruments(),
      this.userService.getSoftwareInstruments()
    ]).pipe(
      map(results => {
        const all = results.flat();

        for (let i = all.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [all[i], all[j]] = [all[j], all[i]];
        }

        return all.slice(0, 12);
      })
    ).subscribe({
      next: (instruments) => {
        console.log('Instrumentos cargados:', instruments);
        this.instruments = instruments;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando instrumentos:', err);
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
}
