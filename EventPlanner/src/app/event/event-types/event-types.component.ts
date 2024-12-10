import {Component, OnInit} from '@angular/core';
import {EventType} from '../model/event-type.model';
import {EventTypeService} from '../event-type.service';
import {MatTableDataSource} from '@angular/material/table';
import {CreateEventTypeComponent} from '../create-event-type/create-event-type.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styleUrl: './event-types.component.css'
})
export class EventTypesComponent implements OnInit{
  dataSource: MatTableDataSource<EventType>;
  displayedColumns: string[] = ['name', 'description','active','recommendedCategories','actions'];

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

  editRow(element: EventType): void {
    console.log('Edit', element);
    // Open dialog or navigate to edit page
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
