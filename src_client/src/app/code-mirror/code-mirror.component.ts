import {Component, Input, Output, ViewChild, EventEmitter, forwardRef, AfterViewInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import * as CodeMirror from 'codemirror';

/**
 * CodeMirror component
 * Usage :
 * <codemirror [(ngModel)]="data" [codeMirrorConfig]="{...}"></codemirror>
 */
@Component({
  selector: 'app-codemirror',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeMirrorComponent),
      multi: true
    }
  ],
  template: `<textarea #host></textarea>`
})
export class CodeMirrorComponent implements AfterViewInit, ControlValueAccessor {
  @Input() config;
  @Output() change = new EventEmitter();
  @ViewChild('host') host;
  @Output() instance: CodeMirror.EditorFromTextArea = null;
  _value = '';

  constructor() {
  }

  get value() {
    return this._value;
  };

  @Input()
  set value(v) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  ngAfterViewInit() {
    this.config = this.config || {};
    this.codeMirrorInit(this.config);
  }

  codeMirrorInit(config) {
    this.instance = CodeMirror.fromTextArea(this.host.nativeElement, config);
    this.instance.setValue(this._value);

    this.instance.on('change', () => {
      this.updateValue(this.instance.getValue());
    });
  }

  updateValue(value) {
    this.value = value;
    this.onTouched();
    this.change.emit(value);
  }

  writeValue(value) {
    this._value = value || '';
    if (this.instance) {
      this.instance.setValue(this._value);
    }
  }

  onChange(_) {
  }

  onTouched() {
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }
}
