import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';
import {SettingsService} from '../settings.service';
import {CodeService} from '../code.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {
  @ViewChild(ModalComponent)
  modal: ModalComponent;
  gutters: { name: string, kind: GutterKind, visible: boolean, aggregate: boolean }[] = [];
  nameFilterQuery: string;
  descriptionFilterQuery: string;

  constructor(private settingsService: SettingsService,
              private codeService: CodeService) {
  }

  ngOnInit(): void {
    const visibleGutters = this.settingsService.getVisibleGutters();
    const aggregateGutters = this.settingsService.getAggregateGutters();

    this.codeService.getAvailableGutters().then((gs: Gutter<any>[]) =>
      this.gutters = gs.map(g => ({
        name: g.name
        , kind: g.kind
        , description: g.description
        , visible: visibleGutters.some(c => c === g.name)
        , aggregate: aggregateGutters.some(c => c === g.name)
      })));
  }

  save() {
    this.settingsService.setVisibleGutters(this.gutters.filter(g => g.visible).map(g => g.name));
    this.settingsService.setAggregateGutters(this.gutters.filter(g => g.aggregate).map(g => g.name));
    location.reload();
  }
}
