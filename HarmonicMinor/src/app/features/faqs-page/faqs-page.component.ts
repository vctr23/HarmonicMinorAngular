import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-faqs-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './faqs-page.component.html',
  styleUrl: './faqs-page.component.css'
})
export class FAQsPageComponent implements OnInit{
  active: number | null = null;
  activeSection: string = 'returns';
  searchTerm: string = '';

  constructor() {}

  ngOnInit(): void {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggle(index: number) {
    this.active = this.active === index ? null : index;
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    this.activeSection = sectionId;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}