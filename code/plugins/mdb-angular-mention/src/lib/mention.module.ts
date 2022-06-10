import { OverlayModule } from '@angular/cdk/overlay';
import { NgModule } from '@angular/core';
import { MdbMentionItemComponent } from './mention-item.component';
import { MdbMentionComponent } from './mention.component';
import { MdbMentionDirective } from './mention.directive';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MdbMentionComponent, MdbMentionDirective, MdbMentionItemComponent],
  imports: [OverlayModule, CommonModule],
  exports: [MdbMentionComponent, MdbMentionDirective, MdbMentionItemComponent],
})
export class MdbMentionModule {}
