import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AppService} from '../../services/app.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Options} from 'ng5-slider';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;

  searchResult: any;
  from: number;
  pageSize: number;
  unSubscribe$ = new Subject();
  private searchText: any;
  private valueChanged: boolean;
  options: Options;
  private fromYear = 1901;
  private toYear = 2100;
  math = Math;
  constructor(private formBuilder: FormBuilder,
              private appService: AppService) {
    this.searchForm = this.formBuilder.group({
      searchText: [''],
      sliderControl: new FormControl([1901, 2100]),
      pageSizeControl: new FormControl(10),
    });
    this.pageSize = 10;
    this.from = 1;
    this.valueChanged = true;
    this.searchText = '';
    this.options = {
      floor: 1900,
      ceil: new Date().getFullYear(),
      step: 1
    };
  }

  ngOnInit(): void {
    this.getSearchResult();
    this.searchForm.valueChanges.pipe(takeUntil(this.unSubscribe$)).subscribe(() => {
      this.getSearchResult();
    });
  }

  private getSearchResult() {
    this.searchText = this.searchForm.get('searchText').value;
    const yearFilter = this.searchForm.get('sliderControl').value;
    this.fromYear = yearFilter[0];
    this.toYear = yearFilter[1];
    this.pageSize = +this.searchForm.get('pageSizeControl').value;
    this.appService.search(this.searchText, this.fromYear, this.toYear, this.from, this.pageSize).pipe(takeUntil(this.unSubscribe$)).subscribe(res => {
      this.searchResult = res;
    });
  }

  prev() {
    if (this.from > 1) {
      this.from -= this.pageSize;
      this.from = Math.max(this.from, 1);
      this.getSearchResult();
    }
  }

  next() {
    if (this.from + this.pageSize <= this.searchResult.hitsMetadata.total.value) {
      this.from += this.pageSize;
      this.from = Math.min(this.from, this.searchResult.hitsMetadata.total.value);
      this.getSearchResult();
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
