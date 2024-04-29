import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ListPage } from '../list.page';

@Component({
  selector: 'app-input-list',
  templateUrl: './input-list.component.html',
  styleUrls: ['./input-list.component.scss'],
})
export class InputListComponent implements OnInit {

  @Input() item = ''; nome = '';
  @Output() newItemEvent = new EventEmitter<string>();

  // powers = ['Really Smart', 'Super Flexible',
  //           'Super Hot', 'Weather Changer'];

  // model = new ListPage(18, 'Dr. IQ', this.powers[0], 'Chuck Overstreet');

  submitted = false;

  onSubmit() { this.submitted = true; }

  constructor() { }

  ngOnInit() {}

}
