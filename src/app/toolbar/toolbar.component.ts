import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogState } from '@angular/material';

@Component({
  template: '<div>I asked nicely :(</div>'
})
export class ComplaintComponent {

}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() caption: string;

  constructor(public dialogs: MatDialog) { }

  ngOnInit() {

  }

  complain() {
    this.dialogs.open(ComplaintComponent);
  }
}
