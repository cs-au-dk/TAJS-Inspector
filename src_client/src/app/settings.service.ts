import {Injectable} from '@angular/core';

@Injectable()
export class SettingsService {
  public readonly STORAGE_KEY_PREFIX = 'dk.brics.tajs.inspector';
  private readonly STORAGE_KEY_VISIBLE_GUTTERS = `${this.STORAGE_KEY_PREFIX}.visibleGutters`;
  private readonly STORAGE_KEY_AGGREGATE_GUTTERS = `${this.STORAGE_KEY_PREFIX}.aggregateGutters`;

  constructor() {
  }

  getVisibleGutters(): string[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_VISIBLE_GUTTERS)) || [];
  }

  setVisibleGutters(gutters: string[]): void {
    localStorage.setItem(this.STORAGE_KEY_VISIBLE_GUTTERS, JSON.stringify(gutters));
  }

  getAggregateGutters(): string[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_AGGREGATE_GUTTERS)) || [];
  }

  setAggregateGutters(gutters: string[]): void {
    localStorage.setItem(this.STORAGE_KEY_AGGREGATE_GUTTERS, JSON.stringify(gutters));
  }

}
