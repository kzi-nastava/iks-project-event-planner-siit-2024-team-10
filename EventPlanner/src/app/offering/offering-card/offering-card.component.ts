import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Offering } from '../model/offering.model';
import { Router } from '@angular/router';
import { ImageService } from '../image-service/image.service';

@Component({
  selector: 'app-offering-card',
  templateUrl: './offering-card.component.html',
  styleUrls: ['./offering-card.component.css']
})
export class OfferingCardComponent {
  @Input() offering: Offering;
  @Output() clicked: EventEmitter<Offering> = new EventEmitter<Offering>();

  constructor(
    private router: Router,
    private imageService: ImageService
  ) {}

  get offeringImage(): string {
    const photos = this.offering.photos || [];
    return this.imageService.getImageUrl(photos[0]);
  }

  onOfferingClicked(): void {
    this.router.navigate(['/offering', this.offering.id]);
    this.clicked.emit(this.offering);
  }
}
