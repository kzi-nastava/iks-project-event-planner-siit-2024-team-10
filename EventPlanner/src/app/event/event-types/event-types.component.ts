import {Component, inject, OnInit} from '@angular/core';
import {EventType} from '../model/event-type.model';
import {EventTypeService} from '../event-type.service';
import {MatTableDataSource} from '@angular/material/table';
import {CreateEventTypeComponent} from '../create-event-type/create-event-type.component';
import {MatDialog} from '@angular/material/dialog';
import {EditEventTypeComponent} from '../edit-event-type/edit-event-type.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styleUrl: './event-types.component.css'
})
export class EventTypesComponent implements OnInit{
  dataSource: MatTableDataSource<EventType>;
  displayedColumns: string[] = ['name', 'description','recommendedCategories','actions'];
  snackBar:MatSnackBar = inject(MatSnackBar);

  constructor(private service:EventTypeService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.refreshDataSource();
  }

  private refreshDataSource() {
    this.service.getAll().subscribe({
      next: (eventTypes: EventType[]) => {
        this.dataSource = new MatTableDataSource<EventType>(eventTypes);
      },
      error: (_) => {
        console.log("Error loading event types")
      }
    })
  }

  openEditDialog(element: EventType): void {
    const dialogRef = this.dialog.open(EditEventTypeComponent, {
      width: '400px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.edit(result).subscribe({
          next: (response) => {
            this.refreshDataSource();
            this.snackBar.open('Event type updated successfully','OK',{duration:3000});
          },
          error: (err) => console.error('Error adding event type:', err),
        });
      }
    });
  }

  deleteRow(element: EventType): void {

  }

  openAddEventTypeDialog() {
    const dialogRef = this.dialog.open(CreateEventTypeComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.service.add(result).subscribe({
          next: (response) => {
            console.log('Event type added:', response);
            this.refreshDataSource();
            },
          error: (err) => console.error('Error adding event type:', err),
        });
      }
    });
  }

  getCategoryNames(eventType:EventType): string {
    return eventType.recommendedCategories.map(x=>x.name).join(', ');
  }
}
