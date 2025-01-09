import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { select } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import {EventStats} from '../model/event.stats.model';

interface RatingPoint {
  rating: number;
  count: number;
}

@Component({
  selector: 'app-open-event-report',
  templateUrl: './open-event-report.component.html',
  styleUrl: './open-event-report.component.css'
})
export class OpenEventReportComponent implements OnInit, AfterViewInit {
  @ViewChild('chartContainer') private chartContainer!: ElementRef;
  protected eventStats:EventStats;
  private svg: any;
  private width = 650;
  private height = 400;
  private margin = { top: 20, right: 20, bottom: 40, left: 40 };

  ngOnInit() {
    this.eventStats={
      id: 1,
      oneStarCount: 10,
      twoStarCount: 5,
      threeStarCount: 15,
      fourStarCount: 30,
      fiveStarCount: 40,
      participantsCount: 100,
      averageRating: 4.2,
      eventName: "Tech Conference 2025"
    };
    if (this.eventStats) {
      this.createChart();
    }
  }
  ngAfterViewInit() {
    // Move chart creation here after view is initialized
    if (this.eventStats) {
      this.createChart();
    }
  }

  private createChart(): void {
    if (!this.chartContainer || !this.eventStats) return;

    // Remove any existing SVG
    select(this.chartContainer.nativeElement).select('svg').remove();

    // Create SVG
    this.svg = select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const ratings: RatingPoint[] = [
      { rating: 1, count: this.eventStats.oneStarCount },
      { rating: 2, count: this.eventStats.twoStarCount },
      { rating: 3, count: this.eventStats.threeStarCount },
      { rating: 4, count: this.eventStats.fourStarCount },
      { rating: 5, count: this.eventStats.fiveStarCount }
    ];

    // Create scales
    const x = scaleBand()
      .range([this.margin.left, this.width - this.margin.right])
      .domain(['1', '2', '3', '4', '5'])
      .padding(0.2);

    const y = scaleLinear()
      .range([this.height - this.margin.bottom, this.margin.top])
      .domain([0, Math.max(
        this.eventStats.oneStarCount,
        this.eventStats.twoStarCount,
        this.eventStats.threeStarCount,
        this.eventStats.fourStarCount,
        this.eventStats.fiveStarCount
      )]);

    // Add X axis
    this.svg.append('g')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(axisBottom(x))
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', 35)
      .attr('fill', 'black')
      .text('Rating');

    // Add Y axis
    this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},0)`)
      .call(axisLeft(y))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -35)
      .attr('x', -(this.height / 2))
      .attr('fill', 'black')
      .text('Number of Ratings');

    // Add bars
    this.svg.selectAll('rect')
      .data(ratings)
      .enter()
      .append('rect')
      .style('fill', '#bebce6')
      .attr('class', 'bar')
      .attr('x', (d: RatingPoint) => x(d.rating.toString()))
      .attr('y', (d: RatingPoint) => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', (d: RatingPoint) => this.height - this.margin.bottom - y(d.count))
      .append('title')
      .text((d: RatingPoint) => `Rating: ${d.rating} Stars\nCount: ${d.count}`);
    }
  }
