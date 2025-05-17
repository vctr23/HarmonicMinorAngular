import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms-page',
  imports: [RouterLink],
  templateUrl: './terms-page.component.html',
  styleUrl: './terms-page.component.css'
})
export class TermsPageComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


}
