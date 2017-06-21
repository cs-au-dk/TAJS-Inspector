import {Utility} from './utility';

export class ElementBuilder {
  static numberGutter(content: string, tooltip: string, maxValue?: number): HTMLElement {
    function formatNumber(num: number): string {
      const si = [
        {value: 1E18, symbol: 'E'},
        {value: 1E15, symbol: 'P'},
        {value: 1E12, symbol: 'T'},
        {value: 1E9, symbol: 'G'},
        {value: 1E6, symbol: 'M'},
        {value: 1E3, symbol: 'k'},
        {value: 1E0, symbol: ''}
      ], rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      const absNum = Math.abs(num);
      for (let i = 0; i < si.length; i++) {
        if (absNum >= si[i].value) {
          const base = (num / si[i].value);
          const absBase = Math.abs(base);
          return base.toFixed(absBase >= 100 ? 0 : absBase >= 10 ? 1 : 2).replace(rx, '$1') + si[i].symbol;
        }
      }
      return num.toFixed(2).replace(rx, '$1');
    }

    const number = +content;
    const elem = <HTMLElement> document.createElement('span');
    elem.className = 'colored-gutter center';
    elem.innerHTML = formatNumber(number);
    elem.title = tooltip;
    if (maxValue !== null) {
      elem.style.backgroundColor = Utility.makeRGBColorStringFromGreenToRed(this.getRelative(number, maxValue));
    }
    return elem;
  }

  static landmark() {
    const elem = <HTMLElement>document.createElement('span');
    elem.className = 'glyphicon glyphicon-bookmark';
    elem.style.color = 'red';
    return elem;
  }

  static message(title: string) {
    const elem = <HTMLElement>document.createElement('div');
    elem.className = 'message-notice';
    elem.title = title;
    return elem;
  }

  private static getRelative(current: number, max: number): number {
    return (max === 0) ? 0 : ((max - current) / max);
  }
}
