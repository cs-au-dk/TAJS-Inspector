import {Injectable} from "@angular/core";

@Injectable()
export class SettingsService {
  private readonly STORAGE_KEY_PREFIX = "dk.brics.tajs.la2";
  private readonly STORAGE_KEY_VISIBLE_GUTTERS = `${this.STORAGE_KEY_PREFIX}/visibleGutters`;
  private readonly STORAGE_KEY_AGGREGATE_GUTTERS = `${this.STORAGE_KEY_PREFIX}/aggregateGutters`;
  private readonly STORAGE_KEY_VISIBLE_LINEVALUES = `${this.STORAGE_KEY_PREFIX}/lineValues/visible`;

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

  getVisibilityLineValueToolbar(): boolean {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY_VISIBLE_LINEVALUES)) || false;
  }

  setVisibilityLineValueToolbar(visible: boolean): void {
    localStorage.setItem(this.STORAGE_KEY_VISIBLE_LINEVALUES, JSON.stringify(visible));
  }

}
