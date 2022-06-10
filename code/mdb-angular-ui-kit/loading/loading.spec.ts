import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MdbLoadingModule } from './loading.module';

const template = `
<div class="loader-container" style="height: 300px; width: 100%; z-index: 1029" #container>
  <mdb-loading [show]="show" [container]="container" [backdropClass]="backdropClass">
    <div class="loading-spinner basic-loader">
      <div class="spinner-border loading-icon text-success" role="status"></div>
        <span class="loading-text text-success">Loading...</span>
    </div>
  </mdb-loading>
</div>

<mdb-loading [show]="showFullscreen" [fullscreen]="true">
  <div class="loading-spinner fullscreen-loader">
    <div class="spinner-border loading-icon text-success" role="status"></div>
      <span class="loading-text text-success">Loading...</span>
    </div>
</mdb-loading>
`;

@Component({
  selector: 'mdb-loading-test',
  template: template,
})
class TestLoadingComponent {
  show = false;
  showFullscreen = false;
  backdropClass: string;
}

describe('MDB Loading', () => {
  let fixture: ComponentFixture<TestLoadingComponent>;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestLoadingComponent],
      imports: [MdbLoadingModule],
      teardown: { destroyAfterEach: false },
    });
    fixture = TestBed.createComponent(TestLoadingComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should toggle loader on show input value change', () => {
    component.show = true;
    fixture.detectChanges();

    let loader = fixture.nativeElement.querySelector('.basic-loader');
    let backdrop = document.querySelector('.loading-backdrop');

    expect(loader).not.toBe(null);
    expect(backdrop).not.toBe(null);

    component.show = false;
    fixture.detectChanges();

    loader = document.querySelector('.basic-loader');
    backdrop = document.querySelector('.loading-backdrop');

    expect(loader).toBe(null);
    expect(backdrop).toBe(null);
  });

  it('should add custom backdrop class', () => {
    component.backdropClass = 'custom-class';
    fixture.detectChanges();
    component.show = true;
    fixture.detectChanges();

    let loader = fixture.nativeElement.querySelector('.basic-loader');
    let backdrop = document.querySelector('.loading-backdrop');

    expect(loader).not.toBe(null);
    expect(backdrop).not.toBe(null);
    expect(backdrop.classList).toContain('custom-class');
  });

  it('should add position-relative class to loader container', () => {
    const container = fixture.nativeElement.querySelector('.loader-container');

    component.show = true;
    fixture.detectChanges();

    expect(container.classList).toContain('position-relative');
  });

  it('should toggle fulscreen loader on show input value change if fullscreen is set to true', fakeAsync(() => {
    component.showFullscreen = true;
    fixture.detectChanges();

    let loader = document.querySelector('.fullscreen-loader');
    let backdrop = document.querySelector('.loading-backdrop-fullscreen');

    expect(loader).not.toBe(null);
    expect(backdrop).not.toBe(null);

    component.showFullscreen = false;
    fixture.detectChanges();
    flush();

    loader = document.querySelector('.fullscreen-loader');
    backdrop = document.querySelector('.loading-backdrop-fullscreen');

    expect(loader).toBe(null);
    expect(backdrop).toBe(null);
  }));
});
