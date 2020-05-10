import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {AppService} from '../../services/app.service';
import {debounceTime, takeUntil} from 'rxjs/operators';
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
  pageSize: number;
  pageNo: number;
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
    this.pageNo = 0;
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
    this.searchForm.valueChanges.pipe(debounceTime(300), takeUntil(this.unSubscribe$)).subscribe(() => {
      this.getSearchResult();
    });
  }

  private getSearchResult() {
    this.searchText = this.searchForm.get('searchText').value;
    const yearFilter = this.searchForm.get('sliderControl').value;
    this.fromYear = yearFilter[0];
    this.toYear = yearFilter[1];
    this.pageSize = +this.searchForm.get('pageSizeControl').value;
    this.appService.search(this.searchText, this.fromYear, this.toYear, this.pageSize * this.pageNo + 1, this.pageSize).pipe(takeUntil(this.unSubscribe$)).subscribe(res => {
      this.searchResult = res;
      if (this.pageNo * this.pageSize + 1 > this.searchResult.hitsMetadata.total.value && this.searchResult.hitsMetadata.total.value > 0) {
        this.pageNo = (this.searchResult.hitsMetadata.total.value - 1) / this.pageSize;
        this.pageNo = this.pageNo | 0;
        this.getSearchResult();
      }
    });
  }

  prev() {
    if (this.pageNo > 0) {
      this.pageNo--;
      this.getSearchResult();
    }

  }

  next() {
    if ((this.pageNo + 1) * this.pageSize + 1 <= this.searchResult.hitsMetadata.total.value) {
      this.pageNo++;
      this.getSearchResult();
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next();
    this.unSubscribe$.complete();
  }
}
