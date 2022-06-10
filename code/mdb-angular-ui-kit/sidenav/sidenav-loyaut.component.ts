import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MdbSidenavComponent } from './sidenav.component';
@Component({
  selector: 'mdb-sidenav-layout',
  templateUrl: 'sidenav-layaut.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdbSidenavLayoutComponent implements AfterViewInit {
  @ContentChild('sidenav') _sidenav: MdbSidenavComponent;
  @ContentChild('sidenavContent', { read: ElementRef }) _sidenavContent: ElementRef<HTMLElement>;
  @ViewChild('backdrop') _backdropEl: ElementRef<HTMLElement>;

  public showBackdrop = false;
  public backdropStyle = {
    transition: '',
    position: '',
    width: '',
    height: '',
    opacity: 0,
  };

  constructor(private _cdRef: ChangeDetectorRef) {}

  markForCheck(): void {
    this._cdRef.markForCheck();
  }

  ngAfterViewInit(): void {
    this.backdropStyle.transition = `opacity ${this._sidenav.sidenavTransitionDuration} ease-out`;
    this.backdropStyle.position = this._sidenav.position;
    this.backdropStyle.width = this._sidenav.position === 'fixed' ? '100vw' : '100%';
    this.backdropStyle.height = this._sidenav.position === 'fixed' ? '100vh' : '100%';
    this.backdropStyle.opacity = 1;

    // Backdrop
    if (this._sidenav.backdrop && !this._sidenav.hidden && this._sidenav.mode === 'over') {
      this.showBackdrop = true;
    }
  }

  onBackdropClick(): void {
    this.markForCheck();

    this._sidenav.triggetVisibilityEvents(false);
    this._sidenav.updateSidenav(false);
  }

  toggleBackdrop(show: boolean): void {
    this.markForCheck();

    if (show && this._sidenav.mode === 'over') {
      this.showBackdrop = true;
      this.backdropStyle.opacity = 1;
    } else {
      this.backdropStyle.opacity = 0;

      setTimeout(() => {
        this.showBackdrop = false;
        this.markForCheck();
      }, this._sidenav.transitionDuration);
    }
  }
}
