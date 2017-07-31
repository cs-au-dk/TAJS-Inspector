import {Component, OnInit} from '@angular/core';
import {CodeService} from '../code.service';
import {GutterSums} from '../gutter-sums';
import {SettingsService} from '../settings.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  sums: GutterSums[] = [];
  optionData: OptionData = {options: {}};
  filterQuery: string;
  aggregates: string[];

  constructor(private codeService: CodeService,
              private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.aggregates = this.settingsService.getAggregateGutters();
    this.codeService.getSums(this.aggregates).then((s: GutterSums[]) => this.sums = s);
    this.codeService.getOptionData().then((options: OptionData) => this.optionData = options);
  }

}
