import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-datelabel',
  templateUrl: './datelabel.component.html',
  styleUrls: ['./datelabel.component.css']
})
export class DatelabelComponent implements OnInit {
  ngOnInit(): void {
  }
  @Input() dateObj;
  @Input() dateRef;

  @Output()
  remove = new EventEmitter();

  constructor() { }
  /**
   * remove emits on the date
   */
  removeMe() {
    this.remove.emit('');
  }
}
