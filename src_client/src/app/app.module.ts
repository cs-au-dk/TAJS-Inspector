import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {TreeModule} from 'angular-tree-component';
import {DataTableModule} from 'angular2-datatable';
import {SplitPaneModule} from 'ng2-split-pane/lib/ng2-split-pane';
import {ToastyModule} from 'ng2-toasty';
import {ApiService} from './api.service';
import {AppErrorHandler} from './app-error-handler';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {AppComponent} from './app.component';
import {CallHierarchyComponent} from './call-hierarchy/call-hierarchy.component';
import {CodeMirrorComponent} from './code-mirror/code-mirror.component';
import {CodeService} from './code.service';
import {DataFilterPipe} from './data-filter.pipe';
import {EditorComponent} from './editor/editor.component';
import {EllipsisPipe} from './ellipsis.pipe';
import {FileJumpComponent} from './file-jump/file-jump.component';
import {FileMessageSearchComponent} from './file-message-search/file-message-search.component';
import {FileViewComponent} from './file-view/file-view.component';
import {LineValuesComponent} from './line-values/line-values.component';
import {ModalComponent} from './modal/modal.component';
import {OverviewComponent} from './overview/overview.component';
import {RelatedLocationsComponent} from './related-locations/related-locations.component';
import {SettingsModalComponent} from './settings-modal/settings-modal.component';
import {SettingsService} from './settings.service';
import {ShortcutModalComponent} from './shortcut-modal/shortcut-modal.component';
import {UIStateStore} from './ui-state.service';
import {KeysPipe} from './keys-pipe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FileViewComponent,
    CodeMirrorComponent,
    FileJumpComponent,
    OverviewComponent,
    DataFilterPipe,
    LineValuesComponent,
    EditorComponent,
    ShortcutModalComponent,
    ModalComponent,
    SettingsModalComponent,
    FileMessageSearchComponent,
    EllipsisPipe,
    CallHierarchyComponent,
    RelatedLocationsComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    DataTableModule,
    SplitPaneModule,
    TreeModule,
    ToastyModule.forRoot()
  ],
  providers: [UIStateStore, SettingsService, CodeService, ApiService, HttpModule, {
    provide: ErrorHandler,
    useClass: AppErrorHandler
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
