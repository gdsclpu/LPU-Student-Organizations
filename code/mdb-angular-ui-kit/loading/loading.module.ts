import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MdbLoadingComponent } from './loading.component';

@NgModule({
  imports: [CommonModule, OverlayModule, PortalModule],
  declarations: [MdbLoadingComponent],
  exports: [MdbLoadingComponent],
})
export class MdbLoadingModule {}
