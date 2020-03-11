import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {

  @Input() details: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  openCard() {
    this.router.navigate([this.details.id]);
  }
}
