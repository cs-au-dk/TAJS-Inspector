import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {FileViewComponent} from './file-view/file-view.component';
import {CodeMirrorComponent} from './code-mirror/code-mirror.component';
import {CodeService} from './code.service';
import {FileJumpComponent} from './file-jump/file-jump.component';
import {OverviewComponent} from './overview/overview.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {DataTableModule} from 'angular2-datatable';
import {DataFilterPipe} from './data-filter.pipe';
import {LineValuesComponent} from './line-values/line-values.component';
import {FileEditorComponent} from './file-editor/file-editor.component';
import {ApiService} from './api.service';
import {BookmarkService} from './bookmark.service';
import {ShortcutModalComponent} from './shortcut-modal/shortcut-modal.component';
import {ModalComponent} from './modal/modal.component';
import {SplitPaneModule} from 'ng2-split-pane/lib/ng2-split-pane';
import {TreeModule} from 'angular-tree-component';
import {ToastyModule} from 'ng2-toasty';
import {SettingsModalComponent} from './settings-modal/settings-modal.component';
import {SettingsService} from './settings.service';
import {FileMessageSearchComponent} from './file-message-search/file-message-search.component';
import {EllipsisPipe} from './ellipsis.pipe';
import {AppErrorHandler} from './app-error-handler';
import {CallHierarchyComponent} from './call-hierarchy/call-hierarchy.component';

@NgModule({
  declarations: [
    AppComponent,
    FileViewComponent,
    CodeMirrorComponent,
    FileJumpComponent,
    OverviewComponent,
    DataFilterPipe,
    LineValuesComponent,
    FileEditorComponent,
    ShortcutModalComponent,
    ModalComponent,
    SettingsModalComponent,
    FileMessageSearchComponent,
    EllipsisPipe,
    CallHierarchyComponent
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
  providers: [SettingsService, BookmarkService, CodeService, ApiService, HttpModule, {
    provide: ErrorHandler,
    useClass: AppErrorHandler
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
