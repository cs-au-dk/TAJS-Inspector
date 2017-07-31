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

  static getGutterID(gutter: string): string {
    return gutter.replace(/[^a-z0-9]/g, function (s) {
      const c = s.charCodeAt(0);
      if (c === 32) {
        return '-';
      } else if (c >= 65 && c <= 90) {
        return '_' + s.toLowerCase();
      }
      return '__' + ('000' + c.toString(16)).slice(-4);
    });
  }

  static sortLineValues(values: LineValue[]): LineValue[] {
    return values.sort((v1, v2) => {
      return v1.location.range.columnStart - v2.location.range.columnStart || v1.location.order - v2.location.order;
    });
  }
}
