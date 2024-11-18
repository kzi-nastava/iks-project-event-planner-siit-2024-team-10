import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Offering } from '../model/offering.model';
import { Product } from '../model/product.model';
import { Service } from '../model/service.model';

@Component({
  selector: 'app-offering-card',
  templateUrl: './offering-card.component.html',
  styleUrls: ['./offering-card.component.css']
})
export class OfferingCardComponent {
  @Input()
  offering: Offering;

  @Output()
  clicked: EventEmitter<Offering> = new EventEmitter<Offering>();

  onOfferingClicked(): void{
    console.log(this.offering)
  }

  isProduct(offering: Offering): boolean {
    return offering.isProduct;
  }

  isService(offering: Offering): boolean {
    return !offering.isProduct;
  }
}
