import { TajsLinearGuiAngularPage } from './app.po';

describe('tajs-linear-gui-angular App', function() {
  let page: TajsLinearGuiAngularPage;

  beforeEach(() => {
    page = new TajsLinearGuiAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
