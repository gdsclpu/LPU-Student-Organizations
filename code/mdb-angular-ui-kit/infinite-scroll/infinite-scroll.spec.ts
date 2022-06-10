import { Component, ElementRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MdbInfiniteScrollDirective } from './infinite-scroll.directive';
import { MdbInfiniteScrollModule } from './infinite-scroll.module';

const template = `
<div style="width: 200px">
    <ul
        mdbInfiniteScroll
        class="container list-group infinite-scroll infinite-scroll-basic"
        id="basic-example"
        style="height: 261px; max-height: 261px; overflow-y: scroll"
        #list
    >
    <li class="list-group-item d-flex align-items-center">
        <i class="far fa-angry fa-3x me-4"></i> Angry
    </li>
    <li class="list-group-item d-flex align-items-center">
        <i class="far fa-dizzy fa-3x me-4"></i> Dizzy
    </li>
    <li class="list-group-item d-flex align-items-center">
        <i class="far fa-flushed fa-3x me-4"></i> Flushed
    </li>
    <li class="list-group-item d-flex align-items-center">
        <i class="far fa-frown fa-3x me-4"></i> Frown
    </li>
    </ul>
</div>
`;

@Component({
  selector: 'mdb-infinite-scroll-test',
  template: template,
})
class TestInfiniteScrollComponent {
  @ViewChild(MdbInfiniteScrollDirective) infiniteScroll: MdbInfiniteScrollDirective;
  @ViewChild('list', { read: ElementRef }) _list: ElementRef;

  get list(): HTMLElement {
    return this._list.nativeElement;
  }
}

describe('MDB Infinite Scroll', () => {
  let fixture: ComponentFixture<TestInfiniteScrollComponent>;
  let component: any;

  const originalScrollHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollHeight'
  );

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 396,
    });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestInfiniteScrollComponent],
      imports: [MdbInfiniteScrollModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestInfiniteScrollComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should emit infiniteScrollCompleted event when scroll position is at the bottom of element', () => {
    const spy = jest.spyOn(component.infiniteScroll.infiniteScrollCompleted, 'emit');

    component.list.getBoundingClientRect = () => ({
      height: 264,
    });

    component.list.scrollTop = component.list.scrollHeight;
    component.list.dispatchEvent(new CustomEvent('scroll'));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });
});
