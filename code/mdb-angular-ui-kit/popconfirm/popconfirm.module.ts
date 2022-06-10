import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MdbPopconfirmContainerComponent } from './popconfirm-container.component';
import { MdbPopconfirmService } from './popconfirm.service';

@NgModule({
  imports: [OverlayModule, PortalModule],
  exports: [MdbPopconfirmContainerComponent],
  declarations: [MdbPopconfirmContainerComponent],
  providers: [MdbPopconfirmService],
})
export class MdbPopconfirmModule {}
