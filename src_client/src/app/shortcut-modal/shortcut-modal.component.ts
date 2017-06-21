import {Component, ViewChild} from '@angular/core';
import {ModalComponent} from '../modal/modal.component';

@Component({
  selector: 'app-shortcut-modal',
  templateUrl: 'shortcut-modal.component.html',
  styleUrls: ['shortcut-modal.component.css']
})
export class ShortcutModalComponent {
  @ViewChild(ModalComponent)
  modal: ModalComponent;
}
