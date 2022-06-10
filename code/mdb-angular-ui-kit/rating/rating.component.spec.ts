import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MdbRatingModule } from './rating.module';
import { MdbRatingComponent } from './rating.component';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'mdb-rating-test',
  template: `
    <mdb-rating [readonly]="readonly">
      <mdb-rating-icon [icon]="'far fa-angry fa-lg'" [color]="'#673ab7'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-frown fa-lg'" [color]="'#3f51b5'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-meh fa-lg'" [color]="'#2196f3'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-smile fa-lg'" [color]="'#03a9f4'"></mdb-rating-icon>
      <mdb-rating-icon [icon]="'far fa-grin-stars fa-lg'" [color]="'#00bcd4'"></mdb-rating-icon>
    </mdb-rating>
  `,
})
class TestRatingComponent {
  @ViewChild(MdbRatingComponent) _rating: MdbRatingComponent;
  public readonly = false;
}

describe('MDB Rating', () => {
  let fixture: ComponentFixture<TestRatingComponent>;
  let component: any;
  let mdbRating: any;
  let mdbRatingIcons: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestRatingComponent],
      imports: [MdbRatingModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestRatingComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    mdbRating = fixture.debugElement.query(By.css('mdb-rating'));
    mdbRatingIcons = fixture.debugElement.queryAll(By.css('mdb-rating-icon'));
  });

  // it('should set active on mouseenter and remove active after mouseleave', fakeAsync(() => {
  //   expect(mdbRatingIcons[0].nativeElement.firstChild.classList.contains('active')).toBe(false);

  //   mdbRatingIcons[0].nativeElement.firstChild.dispatchEvent(new MouseEvent('mouseenter'));

  //   fixture.detectChanges();
  //   flush();

  //   expect(mdbRatingIcons[0].nativeElement.firstChild.classList.contains('active')).toBe(true);

  //   mdbRating.nativeElement.firstChild.dispatchEvent(new MouseEvent('mouseleave'));

  //   fixture.detectChanges();
  //   flush();

  //   expect(mdbRatingIcons[0].nativeElement.firstChild.classList.contains('active')).toBe(false);
  // }));

  it('should set active after click', fakeAsync(() => {
    // expect(mdbRatingIcons[2].nativeElement.firstChild.classList.contains('active')).toBe(false);
    // mdbRatingIcons[2].nativeElement.firstChild.dispatchEvent(new MouseEvent('mouseenter'));
    // mdbRating.nativeElement.firstChild.click();
    // fixture.detectChanges();
    // flush();
    // expect(mdbRatingIcons[2].nativeElement.firstChild.classList.contains('active')).toBe(true);
    // mdbRatingIcons[1].nativeElement.firstChild.dispatchEvent(new MouseEvent('mouseenter'));
    // mdbRating.nativeElement.firstChild.click();
    // fixture.detectChanges();
    // flush();
    // expect(mdbRatingIcons[1].nativeElement.firstChild.classList.contains('active')).toBe(true);
    // expect(mdbRatingIcons[2].nativeElement.firstChild.classList.contains('active')).toBe(false);
  }));
});
