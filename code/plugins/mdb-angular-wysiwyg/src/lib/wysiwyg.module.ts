import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MdbWysiwygComponent } from './wysiwyg.component';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';

@NgModule({
  declarations: [MdbWysiwygComponent],
  imports: [ReactiveFormsModule, CommonModule, MdbDropdownModule, MdbFormsModule, MdbTooltipModule],
  exports: [MdbWysiwygComponent],
})
export class MdbWysiwygModule {}
