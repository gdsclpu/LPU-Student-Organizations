import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { MdbNotificationContainerComponent } from './notification-container.component';
import { MdbNotificationService } from './notification.service';

@NgModule({
  imports: [OverlayModule, PortalModule],
  exports: [MdbNotificationContainerComponent],
  declarations: [MdbNotificationContainerComponent],
  providers: [MdbNotificationService],
})
export class MdbNotificationModule {}
