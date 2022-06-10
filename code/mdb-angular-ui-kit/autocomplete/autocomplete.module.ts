import { NgModule } from '@angular/core';

import { MdbAutocompleteComponent } from './autocomplete.component';
import { MdbAutocompleteDirective } from './autocomplete.directive';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MdbOptionModule } from 'mdb-angular-ui-kit/option';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [CommonModule, HttpClientModule, FormsModule, MdbOptionModule, OverlayModule],
  declarations: [MdbAutocompleteComponent, MdbAutocompleteDirective],
  exports: [MdbAutocompleteComponent, MdbAutocompleteDirective, MdbOptionModule],
})
export class MdbAutocompleteModule {}
