import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Offering } from '../model/offering.model';
import { Product } from '../model/product.model';
import { Service } from '../model/service.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offering-card',
  templateUrl: './offering-card.component.html',
  styleUrls: ['./offering-card.component.css']
})
export class OfferingCardComponent {
  @Input() offering: Offering;
  @Output() clicked: EventEmitter<Offering> = new EventEmitter<Offering>();

  constructor(private router: Router) {}

  onOfferingClicked(): void {
    this.router.navigate(['/offering', this.offering.id]);
    this.clicked.emit(this.offering);
  }
}