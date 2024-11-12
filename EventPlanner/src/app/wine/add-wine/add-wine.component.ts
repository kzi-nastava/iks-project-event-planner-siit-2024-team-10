import { Component } from '@angular/core';
import { WineService } from '../wine.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Wine } from '../model/wine.model';

@Component({
  selector: 'app-add-wine',
  templateUrl: './add-wine.component.html',
  styleUrl: './add-wine.component.css'
})
export class AddWineComponent {
  
  createWineForm = new FormGroup({
    name: new FormControl(),
    year: new FormControl(),
    grapes: new FormControl(),
    country: new FormControl(),
    region: new FormControl('Republika Srbija', [Validators.required]),
  });

  constructor(private wineService: WineService) {}

  ngOnInit(): void {}

  create() {
    if (this.createWineForm.valid) {
      const wine: Wine = {
        _id: Math.random(),
        name: this.createWineForm.value.name,
        description: '',
        year: this.createWineForm.value.year,
        grapes: this.createWineForm.value.grapes,
        country: this.createWineForm.value.country,
        region: this.createWineForm.value.region ?? '',
        picture: '',
      };
      this.wineService.add(wine);
    }
  }
}
