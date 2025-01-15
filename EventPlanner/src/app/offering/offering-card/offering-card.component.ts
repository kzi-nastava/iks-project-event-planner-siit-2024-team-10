import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Offering } from '../model/offering.model';
import { Router } from '@angular/router';
import { environment } from '../../../env/environment';

@Component({
  selector: 'app-offering-card',
  templateUrl: './offering-card.component.html',
  styleUrls: ['./offering-card.component.css']
})
export class OfferingCardComponent {
  @Input() offering: Offering;
  @Output() clicked: EventEmitter<Offering> = new EventEmitter<Offering>();

  constructor(private router: Router) {}

  get offeringImage(): string {
    const photos = this.offering.photos || [];
    if (photos.length > 0) {
      const fileName = photos[0].split('\\').pop()?.split('/').pop();
      return `${environment.apiHost}/images/${fileName}`;
    }
    return 'placeholder-image.png';
  }

  onOfferingClicked(): void {
    this.router.navigate(['/offering', this.offering.id]);
    this.clicked.emit(this.offering);
  }
}
