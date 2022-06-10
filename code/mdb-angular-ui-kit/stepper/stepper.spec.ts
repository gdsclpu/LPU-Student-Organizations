import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbStepComponent } from './step.component';
import { MdbStepperComponent } from './stepper.component';
import { MdbStepperModule } from './stepper.module';

const basicStepperTemplate = `
<mdb-stepper #stepper [orientation]="orientation" [mobile]="isMobile" [mobileBarBreakpoint]="breakpoint">
  <mdb-step name="Step 1" [editable]="editable">Step 1 content</mdb-step>
  <mdb-step name="Step 2" [editable]="editable">Step 2 content</mdb-step>
  <mdb-step name="Step 3" [editable]="editable">Step 3 content</mdb-step>
</mdb-stepper>
`;

const linearStepperTemplate = `
<mdb-stepper [linear]="true">
  <mdb-step name="Step 1">Step 1 content</mdb-step>
  <mdb-step name="Step 2">Step 2 content</mdb-step>
  <mdb-step name="Step 3">Step 3 content</mdb-step>
</mdb-stepper>
`;

@Component({
  template: basicStepperTemplate,
})
export class BasicStepperComponent {
  orientation = 'horizontal';
  isMobile = false;
  breakpoint = 5;
  editable = true;

  @ViewChild(MdbStepperComponent) stepper: MdbStepperComponent;
  @ViewChildren(MdbStepComponent) steps: QueryList<MdbStepComponent>;
}

@Component({
  template: linearStepperTemplate,
})
export class LinearStepperComponent {
  @ViewChild(MdbStepperComponent) stepper: MdbStepperComponent;
  @ViewChildren(MdbStepComponent) steps: QueryList<MdbStepComponent>;
}

describe('MDB Stepper', () => {
  describe('Basic Stepper', () => {
    let fixture: ComponentFixture<BasicStepperComponent>;
    let component: BasicStepperComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BasicStepperComponent],
        imports: [MdbStepperModule, NoopAnimationsModule],
        teardown: { destroyAfterEach: false },
      });

      fixture = TestBed.createComponent(BasicStepperComponent);
      component = fixture.componentInstance;

      fixture.detectChanges();
    });

    it('should render horizontal stepper if orientation is set to horizontal', () => {
      const horizontalHeader = fixture.nativeElement.querySelector('.stepper-horizontal');
      const horizontalContent = fixture.nativeElement.querySelector(
        '.stepper-horizontal-content-container'
      );

      expect(horizontalHeader).not.toBe(null);
      expect(horizontalContent).not.toBe(null);
    });

    it('should render vertical stepper if orientation is set to vertical', () => {
      component.orientation = 'vertical';
      fixture.detectChanges();

      const verticalHeader = fixture.nativeElement.querySelector('.stepper-vertical');
      const verticalContent = fixture.nativeElement.querySelector(
        '.stepper-vertical-content-container'
      );

      expect(verticalHeader).not.toBe(null);
      expect(verticalContent).not.toBe(null);
    });

    it('should render mobile stepper if mobile input is set to true', () => {
      component.orientation = 'horizontal';
      component.isMobile = true;
      fixture.detectChanges();

      const mobileHead = fixture.nativeElement.querySelector('.stepper-mobile-head');
      const mobileContainer = fixture.nativeElement.querySelector('.stepper-mobile');
      const mobileFooter = fixture.nativeElement.querySelector('.stepper-mobile-footer');

      expect(mobileHead).not.toBe(null);
      expect(mobileContainer).not.toBe(null);
      expect(mobileFooter).not.toBe(null);
    });

    it('should display progress bar in mobile mode if number of steps is higher than breakpoint', () => {
      component.orientation = 'horizontal';
      component.isMobile = true;
      component.breakpoint = 2;
      fixture.detectChanges();

      const progressContainer = fixture.nativeElement.querySelector('.stepper-progress-bar');
      const progressBar = fixture.nativeElement.querySelector('.stepper-mobile-progress-bar');

      expect(progressContainer).not.toBe(null);
      expect(progressBar).not.toBe(null);
    });

    it('should mark first step as active by default', () => {
      const steps = fixture.nativeElement.querySelectorAll('.stepper-step');

      expect(steps[0].classList).toContain('stepper-active');
    });

    it('should change active step on step header click', fakeAsync(() => {
      let steps = fixture.nativeElement.querySelectorAll('.stepper-step');
      let stepHeads = fixture.nativeElement.querySelectorAll('.stepper-head');
      expect(steps[0].classList).toContain('stepper-active');

      stepHeads[1].click();
      flush();
      fixture.detectChanges();
      steps = fixture.nativeElement.querySelectorAll('.stepper-step');
      expect(steps[0].classList).not.toContain('stepper-active');
      expect(steps[1].classList).toContain('stepper-active');
    }));

    it('should go to next step when next() method is used', fakeAsync(() => {
      component.stepper.next();
      flush();
      fixture.detectChanges();

      const steps = fixture.nativeElement.querySelectorAll('.stepper-step');
      expect(steps[1].classList).toContain('stepper-active');
    }));

    it('should go to previous step when previous() method is used', fakeAsync(() => {
      component.stepper.setNewActiveStep(1);
      flush();
      fixture.detectChanges();

      component.stepper.previous();
      flush();
      fixture.detectChanges();

      const steps = fixture.nativeElement.querySelectorAll('.stepper-step');
      expect(steps[0].classList).toContain('stepper-active');
    }));

    it('should set new step when setNewActiveStep method is used', fakeAsync(() => {
      component.stepper.setNewActiveStep(2);
      flush();
      fixture.detectChanges();

      const steps = fixture.nativeElement.querySelectorAll('.stepper-step');
      expect(steps[2].classList).toContain('stepper-active');
    }));

    it('should emit stepChange event on step change', fakeAsync(() => {
      const stepChangeSpy = jest.spyOn(component.stepper.stepChange, 'emit');
      component.stepper.setNewActiveStep(2);
      flush();
      fixture.detectChanges();

      expect(stepChangeSpy).toHaveBeenCalledTimes(1);
    }));

    it('should not go back to step that is not editable', fakeAsync(() => {
      const steps = fixture.nativeElement.querySelectorAll('.stepper-step');
      const stepHeads = fixture.nativeElement.querySelectorAll('.stepper-head');
      component.editable = false;

      component.stepper.next();
      flush();
      fixture.detectChanges();

      expect(steps[1].classList).toContain('stepper-active');

      component.stepper.previous();
      flush();
      fixture.detectChanges();

      expect(steps[1].classList).toContain('stepper-active');
      expect(steps[0].classList).not.toContain('stepper-active');

      stepHeads[0].click();
      flush();
      fixture.detectChanges();

      expect(steps[1].classList).toContain('stepper-active');
      expect(steps[0].classList).not.toContain('stepper-active');
    }));

    it('should set correct animation states for every step', fakeAsync(() => {
      const componentInstance = fixture.debugElement.query(
        By.directive(MdbStepperComponent)
      )!.componentInstance;

      expect(componentInstance.getAnimationState(0)).toBe('current');
      expect(componentInstance.getAnimationState(1)).toBe('next');
      expect(componentInstance.getAnimationState(2)).toBe('next');

      component.stepper.next();
      flush();
      fixture.detectChanges();

      expect(componentInstance.getAnimationState(0)).toBe('previous');
      expect(componentInstance.getAnimationState(1)).toBe('current');
      expect(componentInstance.getAnimationState(2)).toBe('next');

      component.stepper.next();
      flush();
      fixture.detectChanges();

      expect(componentInstance.getAnimationState(0)).toBe('previous');
      expect(componentInstance.getAnimationState(1)).toBe('previous');
      expect(componentInstance.getAnimationState(2)).toBe('current');
    }));
  });
});
