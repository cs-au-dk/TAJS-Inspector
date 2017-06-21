export class Utility {

  static makeRGBColorStringFromGreenToRed(relative: number): string {
    // Taken from dk.brics.tajs.meta.lineAnalysis.RelativeColorer

    const byteMax = 255;
    let scale: number = relative * (byteMax * 2);
    let redValue = 0;
    let greenValue = 0;
    if (scale < byteMax) {
      redValue = byteMax;
      greenValue = Math.round(Math.sqrt(scale) * 16);
    } else {
      greenValue = byteMax;
      scale = scale - byteMax;
      redValue = Math.round(byteMax - (scale * scale / byteMax));
    }

    return `rgb(${redValue}, ${greenValue}, 0)`;
  }

  static flattenObjectToString(obj: any, exclude: ((value: any) => boolean), prefix = '', accumulator?: string[]): string[] {
    const res = (accumulator === undefined) ? [] : accumulator;

    Object.keys(obj).forEach(key => {
      const val = obj[key];
      if (val === null) {
        return;
      }

      if (typeof val === 'object' && !(val instanceof Array)) {
        this.flattenObjectToString(val, exclude, prefix + key + ' - ', res);
      } else if (!exclude(val) || val instanceof Array) {
        res.push(prefix + key + ': ' + val.toString());
      }

    });

    return res;
  }

  static getGutterID(gutter: string): string {
    return gutter.split(' ').join('-');
  }

  static sortLineValues(values: LineValue[]): LineValue[] {
    return values.sort((v1, v2) => {
      return v1.location.range.columnStart - v2.location.range.columnStart || v1.location.order - v2.location.order;
    });
  }
}
