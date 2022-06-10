import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MdbLightboxItemDirective } from './lightbox-item.directive';
import { MdbLightboxComponent } from './lightbox.component';
import { MdbLightboxModalComponent } from './lightbox-modal.component';

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: [MdbLightboxComponent, MdbLightboxItemDirective, MdbLightboxModalComponent],
  exports: [MdbLightboxComponent, MdbLightboxItemDirective, MdbLightboxModalComponent],
})
export class MdbLightboxModule {}
