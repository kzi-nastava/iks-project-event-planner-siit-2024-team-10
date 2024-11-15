import { Component } from '@angular/core';

@Component({
  selector: 'app-register-personal',
  templateUrl: './register-personal.component.html',
  styleUrl: './register-personal.component.css'
})
export class RegisterPersonalComponent {
  registerPath:string='';
  onSelectionChange(event: any): void {
    this.registerPath = event.value;
  }
}
