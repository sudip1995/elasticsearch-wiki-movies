import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AppService} from '../../services/app.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  document: any;

  constructor(private activatedRoute: ActivatedRoute,
              private appService: AppService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(param => {
      console.log(param);
      this.appService.getDocWithId(param.id).subscribe(res => {
        this.document = res;
      });
    });
  }

}
