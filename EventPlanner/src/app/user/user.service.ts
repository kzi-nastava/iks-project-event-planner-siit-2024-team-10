import { Injectable } from '@angular/core';
import {Organizer} from './model/organizer.model';
import {Provider} from './model/provider.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  registerOrganizer(organizer: Organizer) : void {
    console.log(organizer);
  }

  registerProvider(provider: Provider) : void {
    console.log(provider);
  }

  login(email:string, password:string) : void {
    console.log(email);
    console.log(password);
  }
}
