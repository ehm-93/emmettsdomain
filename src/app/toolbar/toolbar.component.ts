import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  template: `
  <h1 mat-dialog-title>Please apologize</h1>
  <div mat-dialog-content><p>I asked nicely :(</p></div>
  <div mat-dialog-actions>
    <button mat-button (click)="onApology()">I'm sorry</button>
  </div>
  `
})
export class ComplaintComponent {
  constructor(public dialogRef: MatDialogRef<ComplaintComponent>, public snacks: MatSnackBar) { }

  onApology() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.snacks.open('I forgive you. <3', 'Best friends');
    }
  }
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
