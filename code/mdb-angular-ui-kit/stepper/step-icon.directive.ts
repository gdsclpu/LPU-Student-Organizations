import { Directive, InjectionToken, TemplateRef } from '@angular/core';

export const MDB_STEP_ICON = new InjectionToken<MdbStepIconDirective>('MdbStepIconDirective');

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[mdbStepIcon]',
  providers: [{ provide: MDB_STEP_ICON, useExisting: MdbStepIconDirective }],
})
export class MdbStepIconDirective {
  constructor(public template: TemplateRef<any>) {}
}
