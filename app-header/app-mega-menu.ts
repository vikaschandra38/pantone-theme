import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Inject,
  Output,
  EventEmitter
} from "@angular/core";

@Component({
  selector: "app-mega-menu",
  template: `
    <div class="col" *ngFor="let cols of calumns">
      <li *ngFor="let submenu of (convertMenu?.subCategory)[cols]">
        <a (click)="closemenu()" routerLink="{{ submenu.link }}">{{
          submenu.key
        }}</a>
      </li>
    </div>
  `,
  styles: []
})
export class AppMegaMenuComponent implements OnChanges {
  @Input() convertMenu;
  calumns = [1, 2, 3, 4, 5];
  @Output() menustatus: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnChanges() {}
  mouseon() {
    // console.log('mouse');
  }
  closemenu() {
    // this.menustatus.emit();
  }
}
