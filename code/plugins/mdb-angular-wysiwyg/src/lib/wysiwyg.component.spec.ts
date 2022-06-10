import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbWysiwygOptions } from './wysiwyg-options.interface';
import { MdbWysiwygToolbarOptions } from './wysiwyg-toolbar-options.interface';
import { MdbWysiwygComponent } from './wysiwyg.component';
import { MdbWysiwygModule } from './wysiwyg.module';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-calendar',
  template: '<mdb-wysiwyg #wysiwyg [value]="value"></mdb-wysiwyg>',
})
class DefaultWysiwygComponent {
  @ViewChild('wysiwyg') wysiwyg: MdbWysiwygComponent;
  value;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-calendar',
  template:
    '<mdb-wysiwyg [fixed]="true" [fixedOffsetTop]="50" [toolbarOptions]="disableToolbarOptions"></mdb-wysiwyg>',
})
class FixedWysiwygComponent {
  disableToolbarOptions: MdbWysiwygToolbarOptions = {
    formatting: {
      hidden: true,
    },
    align: {
      hidden: true,
    },
    lists: {
      disabled: false,
      hidden: false,
      insertUnorderedList: { hidden: true },
      indent: { disabled: true },
    },
    showCode: { disabled: true },
  };
}

describe('MdbWysiwygComponent', () => {
  Object.defineProperties(window.HTMLElement.prototype, {
    offsetLeft: {
      get: function () {
        return parseFloat(this.style.marginLeft) || 0;
      },
    },
    offsetTop: {
      get: function () {
        return parseFloat(this.style.marginTop) || 0;
      },
    },
    offsetHeight: {
      get: function () {
        return parseFloat(this.style.height) || 0;
      },
    },
    offsetWidth: {
      get: function () {
        return parseFloat(this.style.width) || 0;
      },
    },
  });

  describe('Wysiwyg Options', () => {
    let component: FixedWysiwygComponent;
    let fixture: ComponentFixture<FixedWysiwygComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MdbWysiwygModule],
        declarations: [FixedWysiwygComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(FixedWysiwygComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should be fixed', () => {
      const toolbar: HTMLElement = document.querySelector('.wysiwyg-toolbar');
      expect(toolbar.classList.contains('sticky-top')).toBe(true);
    });

    it('should have offset top', () => {
      const toolbar: HTMLElement = document.querySelector('.wysiwyg-toolbar');
      expect(toolbar.style.top === '50px').toBe(true);
    });
  });

  describe('Wysiwyg features', () => {
    let component: DefaultWysiwygComponent;
    let fixture: ComponentFixture<DefaultWysiwygComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MdbWysiwygModule],
        declarations: [DefaultWysiwygComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(DefaultWysiwygComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create and remove toolbar toggler', () => {
      expect(document.querySelector('.wysiwyg-toolbar-toggler')).toBe(null);

      document.querySelectorAll('.wysiwyg-toolbar-group').forEach((el: HTMLElement) => {
        el.style.width = '50px';
      });
      const wysiwygContent: HTMLElement = document.querySelector('.wysiwyg-content');
      wysiwygContent.style.width = '100px';

      component.wysiwyg.getToolsWidth();

      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();

      expect(document.querySelector('.wysiwyg-toolbar-toggler')).not.toBe(null);

      document.querySelectorAll('.wysiwyg-toolbar-group').forEach((el: HTMLElement) => {
        el.style.width = '1px';
      });
      wysiwygContent.style.width = '100px';

      component.wysiwyg.getToolsWidth();

      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();

      expect(document.querySelector('.wysiwyg-toolbar-toggler')).toBe(null);
    });

    it('should get code', () => {
      const testValue = '<p>test</p>';
      component.value = testValue;
      fixture.detectChanges();

      expect(component.wysiwyg.getCode()).toBe(testValue);
    });

    it('should toggle text to html', () => {
      const testText = 'test value';
      const testValue = `<p>${testText}</p>`;
      component.value = testValue;
      fixture.detectChanges();

      const decodedValue = testValue
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;');

      expect(document.querySelector('.wysiwyg-content').textContent).toBe(testText);
      expect(document.querySelector('.wysiwyg-content').innerHTML).toBe(testValue);

      const toggleHtmlBtn = document.querySelector('[aria-label="Show HTML code"]') as HTMLElement;
      toggleHtmlBtn.click();
      fixture.detectChanges();

      expect(document.querySelector('.wysiwyg-content').textContent).toBe(testValue);
      expect(document.querySelector('.wysiwyg-content').innerHTML).toBe(decodedValue);
    });
  });
});
