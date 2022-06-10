import { NgModule } from '@angular/core';
import { MdbDraggableDirective } from './draggable.directive';
import { MdbSortableContainerDirective } from './sortable-container.directive';

@NgModule({
  declarations: [MdbDraggableDirective, MdbSortableContainerDirective],
  imports: [],
  exports: [MdbDraggableDirective, MdbSortableContainerDirective],
})
export class MdbDragAndDropModule {}
