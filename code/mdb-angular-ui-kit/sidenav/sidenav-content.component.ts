import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mdb-sidenav-content',
  templateUrl: 'sidenav-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbSidenavContentComponent {
  constructor() {}
}
