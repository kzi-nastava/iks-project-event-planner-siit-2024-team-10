import {Component, inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from '../event.service';
import {Event} from '../model/event.model'
import {AgendaItem} from '../model/agenda-item.model';
import {Observable} from 'rxjs';
import {AccountService} from '../../account/account.service';
import {CreateEventRatingDTO} from '../model/create-event-rating-dto.model';
import {CreatedEventRatingDTO} from '../model/created-event-rating-dto.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {CreateEventTypeComponent} from '../create-event-type/create-event-type.component';
import {CreateAgendaItemComponent} from '../create-agenda-item/create-agenda-item.component';
import {MatDialog} from '@angular/material/dialog';
import {EventType} from '../model/event-type.model';
import {EditEventTypeComponent} from '../edit-event-type/edit-event-type.component';
import {EditAgendaItemComponent} from '../edit-agenda-item/edit-agenda-item.component';
import {ConfirmDialogComponent} from '../../layout/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  event: Event;
  agenda:AgendaItem[];
  userRating:number;
  isFavourite:boolean=false;
  loggedInUserId:number;
  owner:boolean=false;
  admin:boolean=false;
  participating:boolean=false;
  snackBar:MatSnackBar = inject(MatSnackBar)

  constructor(
    private route: ActivatedRoute,
    private eventService:EventService,
    private accountService: AccountService,
    private authService:AuthService,
    private dialog: MatDialog,
    private router: Router,) {
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  setRating(rating: number): void {
    this.userRating = rating;
  }

  toggleFavourite(): void {
    if(this.isFavourite){
      this.accountService.removeEventFromFavourites(this.event.id).subscribe({
        next: () => {
          this.isFavourite = !this.isFavourite;
        },
        error: (err) => {
          this.snackBar.open('Error adding event to favourites','OK',{duration:5000});
          console.error('Error adding event to favourites:', err);
        }
      });
    }
    else {
      this.accountService.addEventToFavourites(this.event.id).subscribe({
        next: () => {
          this.isFavourite = !this.isFavourite;
        },
        error: (err) => {
          this.snackBar.open('Error removing event from favourites','OK',{duration:5000});
          console.error('Error removing event from favourites:', err);
        }
      });
    }
  }

  addReview():void{
    this.eventService.addRating(this.event.id,{rating:this.userRating}).subscribe({
      next: (createdEventRating:CreatedEventRatingDTO) => {
        this.event.averageRating=createdEventRating.averageRating;
        this.snackBar.open('Event rated successfully','OK',{duration:5000});
      },
      error: (err) => {
        this.snackBar.open('Error rating event','OK',{duration:5000});
        console.error('Error rating event:', err);
      }
    });
  }

  ngOnInit(): void {
    this.loggedInUserId=this.authService.getUserId();
    this.admin=this.authService.getRole()=='ADMIN';
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.eventService.getEvent(id).subscribe({
        next: (event: Event) => {
          this.event=event;
          this.owner=event.organizer.id==this.loggedInUserId;
          this.refreshAgenda();
        },
        error: (err) => {
          this.snackBar.open('Error fetching event','OK',{duration:5000});
          console.error('Error fetching event:', err);
        }
      });
      this.accountService.getFavouriteEvent(id).subscribe({
        next: (event:Event) => {
          this.isFavourite = true;
        },
        error: (err) => {
          if(err.status===404)
            this.isFavourite = false;
          else{
            this.snackBar.open('Error fetching favourite event','OK',{duration:5000});
            console.error('Error fetching favourite event:', err);
          }
        }
      });
    })
  }

  refreshAgenda(){
    this.eventService.getEventAgenda(this.event.id).subscribe({
      next: (agenda: AgendaItem[]) => {
        this.agenda=agenda.filter(item=>!item.isDeleted);
      },
      error: (err) => {
        this.snackBar.open('Error fetching event agenda','OK',{duration:5000});
        console.error('Error fetching event agenda:', err);
      }
    });
  }

  openAddAgendaItemDialog() {
    const dialogRef = this.dialog.open(CreateAgendaItemComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.addAgendaItem(this.event.id,result).subscribe({
          next: (response) => {
            this.refreshAgenda();
            this.snackBar.open('Agenda item created successfully','OK',{duration:3000});
          },
          error: (err) => {
            console.error('Error adding agenda item:', err);
            this.snackBar.open('Error adding agenda item','OK',{duration:3000});
          },
        });
      }
    });
  }

  openEditAgendaItemDialog(element: AgendaItem): void {
    const dialogRef = this.dialog.open(EditAgendaItemComponent, {
      width: '400px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.updateAgendaItem(this.event.id,element.id,result).subscribe({
          next: (response) => {
            this.refreshAgenda();
            this.snackBar.open('Agenda item updated successfully','OK',{duration:3000});
          },
          error: (err) => {
            console.error('Error updating agenda item:', err)
            this.snackBar.open('Error updating agenda item','OK',{duration:3000});
          }
        });
      }
    });
  }

  deleteAgendaItem(agendaItemId:number){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data:{message:"Are you sure you want to delete an agenda item?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.deleteAgendaItem(this.event.id,agendaItemId).subscribe({
          next: (response) => {
            this.refreshAgenda();
            this.snackBar.open('Agenda item deleted successfully','OK',{duration:3000});
          },
          error: (err) => {
            console.error('Error deleting agenda item:', err)
            this.snackBar.open('Error deleting agenda item','OK',{duration:3000});
            },
        });
      }
    });
  }
  navigateToChat(): void {
    const sender = this.authService.getAccountId();
    const recipient = this.event.organizer.accountId;
    console.log(sender);
    console.log(recipient);
    this.router.navigate(['/chat'], {
      state: {
        loggedInUserId: sender,
        organizerId: recipient
      }
    });
  }


  addParticipant():void{
    this.eventService.addParticipant(this.event.id).subscribe({
      next: (response) => {
        this.participating=true;
        this.event.participantsCount=response.participantsCount;
        this.snackBar.open('Participation submitted successfully','OK',{duration:3000});
      },
      error: (err) => {
        console.error('Error deleting agenda item:', err)
        this.snackBar.open('Error submitting participation','OK',{duration:3000});
      },
    });
  }

  exportToPdf() {
    this.eventService.generateEventInfoReport(this.event.id).subscribe({
      next: (pdfBlob: Blob) => {
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL);
      },
      error: (err) => {
        console.error('Error generating report:', err);
        this.snackBar.open('Error generating pdf report','OK',{duration:5000});
        console.error('Error generating pdf report:', err);
      }
    });
  }

  deleteEvent(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data:{message:"Are you sure you want to delete this event?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.delete(this.event.id).subscribe({
          next: () => {
            this.snackBar.open('Event deleted successfully','OK',{duration:3000});
            this.router.navigate(['home']);
          },
          error: (err) => {
            console.log(err);
            this.snackBar.open(err.error,'OK',{duration:3000});
          }
        });
      }
    });
  }

  reportUser(user: string): void {
    console.log('Reported user:', user);

    this.snackBar.open('User reported.', 'Close', {
      duration: 3000
      });
  }
}
