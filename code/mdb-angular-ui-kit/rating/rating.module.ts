import { NgModule } from '@angular/core';
import { MdbRatingComponent } from './rating.component';
import { MdbRatingIconComponent } from './rating-icon.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MdbRatingComponent, MdbRatingIconComponent],
  imports: [CommonModule],
  exports: [MdbRatingComponent, MdbRatingIconComponent],
})
export class MdbRatingModule {}
