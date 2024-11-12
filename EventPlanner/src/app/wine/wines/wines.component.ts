import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Wine } from '../model/wine.model';
import { WineService } from '../wine.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-wines',
  templateUrl: './wines.component.html',
  styleUrl: './wines.component.css'
})
export class WinesComponent implements OnInit, AfterViewInit {

  // wines: Wine[];

  // constructor(private service: WineService) {

  // }

  // ngOnInit(): void {
  //   this.getAllWines()
  // }

  // getAllWines(): void {
  //   this.wines = this.service.getAll()
  // }

  wines: Wine[]
  dataSource: MatTableDataSource<Wine>;
  displayedColumns: string[] = ['name', 'year', 'description', 'grapes', 'country'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: WineService) {

  }

  ngOnInit(): void {
    this.wines = this.service.getAll();
    this.dataSource = new MatTableDataSource<Wine>(this.wines);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
