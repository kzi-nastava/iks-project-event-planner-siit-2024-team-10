import {Component, OnInit} from '@angular/core';
import {EventType} from '../model/event-type.model';
import {EventTypeService} from '../event-type.service';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-event-types',
  templateUrl: './event-types.component.html',
  styleUrl: './event-types.component.css'
})
export class EventTypesComponent implements OnInit{
  eventTypes:EventType[]=[];
  dataSource: MatTableDataSource<EventType>;
  displayedColumns: string[] = ['name', 'description','active','recommendedCategories','actions'];

  constructor(private service:EventTypeService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (eventTypes: EventType[]) => {
        //  this.eventTypes=eventTypes;
        console.log(eventTypes);
        this.dataSource=new MatTableDataSource<EventType>(eventTypes);
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

  getCategoryNames(eventType:EventType): string {
    return eventType.recommendedCategories.map(x=>x.name).join(', ');
  }
}
