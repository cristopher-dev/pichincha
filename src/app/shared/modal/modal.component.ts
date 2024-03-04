import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() header: string = '';
  @Input() footer: string = '';
  @Input() section: string = '';
  @Input() showModal: boolean = false;

  @Output() buttonAcceptEvent: EventEmitter<boolean> = new EventEmitter();

  closeModal(): void {
    this.showModal = false;
    this.buttonAcceptEvent.emit(false);
  }

  buttonAccept(): void {
    this.showModal = false;
    this.buttonAcceptEvent.emit(true);
  }
}
