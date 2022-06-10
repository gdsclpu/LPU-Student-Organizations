import { Component, Provider, Type, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { MdbTreeviewModule } from './treeview.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MdbTreeviewComponent } from './treeview.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-calendar',
  template: `
    <mdb-treeview
      textField="name"
      childrenField="children"
      [nodes]="data"
      [color]="color"
    ></mdb-treeview>
  `,
})
class DefaultTreeviewComponent {
  @ViewChild(MdbTreeviewComponent) treeview: MdbTreeviewComponent;

  data = [
    { name: 'One' },
    { name: 'Two' },
    {
      name: 'Three',
      expandId: 'three',

      children: [
        { name: 'Second-one' },
        { name: 'Second-two' },
        {
          name: 'Second-three',
          expandId: 'second-three',
          children: [
            {
              name: 'Third-one',
              expandId: 'third-one',
              children: [{ name: 'Fourth-one' }, { name: 'Fourth-two' }, { name: 'Fourth-three' }],
            },
            { name: 'Third-two' },
            {
              name: 'Third-three',
              expandId: 'third-three',
              children: [{ name: 'Fourth-one' }, { name: 'Fourth-two' }, { name: 'Fourth-three' }],
            },
          ],
        },
      ],
    },
  ];

  color = 'primary';
}

describe('Mdb Treeview', () => {
  let fixture: ComponentFixture<DefaultTreeviewComponent>;
  let element: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultTreeviewComponent],
      imports: [MdbTreeviewModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(DefaultTreeviewComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should collapse elements', fakeAsync(() => {
    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(false);

    const toggler = document.querySelector('#collapse-three-1_2').previousSibling as HTMLElement;

    toggler.click();
    fixture.detectChanges();
    flush();

    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(true);

    toggler.click();
    fixture.detectChanges();
    flush();

    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(false);
  }));

  it('should toggle active class', fakeAsync(() => {
    const toggler = document.querySelector('#collapse-three-1_2').previousSibling as HTMLElement;
    const toggler2 = document.querySelector('#collapse-second-three-1_2_2')
      .previousSibling as HTMLElement;

    expect(toggler.classList.contains('active')).toBe(false);
    expect(toggler2.classList.contains('active')).toBe(false);

    toggler.click();
    fixture.detectChanges();
    flush();

    expect(toggler.classList.contains('active')).toBe(true);
    expect(toggler2.classList.contains('active')).toBe(false);

    toggler2.click();
    fixture.detectChanges();
    flush();

    expect(toggler.classList.contains('active')).toBe(false);
    expect(toggler2.classList.contains('active')).toBe(true);
  }));

  it('should update active color', fakeAsync(() => {
    const treeview = document.querySelector('.treeview') as HTMLElement;

    expect(treeview.classList.contains('treeview-primary')).toBe(true);
    expect(treeview.classList.contains('treeview-secondary')).toBe(false);

    component.color = 'secondary';
    fixture.detectChanges();
    flush();

    expect(treeview.classList.contains('treeview-primary')).toBe(false);
    expect(treeview.classList.contains('treeview-secondary')).toBe(true);
  }));

  it('should expand first list using public method', fakeAsync(() => {
    component.treeview.expand('three');

    fixture.detectChanges();
    flush();

    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(true);
  }));

  it('should collapse all lists', fakeAsync(() => {
    component.data[2].collapsed = false;
    component.data[2].children[2].collapsed = false;
    component.data[2].children[2].children[0].collapsed = false;
    component.data[2].children[2].children[2].collapsed = false;

    component.data = [...component.data];
    fixture.detectChanges();
    flush();

    expect(component.treeview.nodes[2].collapsed).toBe(false);
    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(true);
    expect(component.treeview.nodes[2].children[2].collapsed).toBe(false);
    expect(document.querySelector('#collapse-second-three-1_2_2').classList.contains('show')).toBe(
      true
    );
    expect(component.treeview.nodes[2].children[2].children[0].collapsed).toBe(false);
    expect(document.querySelector('#collapse-third-one-1_2_2_0').classList.contains('show')).toBe(
      true
    );
    expect(component.treeview.nodes[2].children[2].children[2].collapsed).toBe(false);
    expect(document.querySelector('#collapse-third-three-1_2_2_2').classList.contains('show')).toBe(
      true
    );

    component.treeview.collapse();
    fixture.detectChanges();
    flush();

    expect(component.treeview.nodes[2].collapsed).toBe(true);
    expect(document.querySelector('#collapse-three-1_2').classList.contains('show')).toBe(false);
    expect(component.treeview.nodes[2].children[2].collapsed).toBe(true);
    expect(document.querySelector('#collapse-second-three-1_2_2').classList.contains('show')).toBe(
      false
    );
    expect(component.treeview.nodes[2].children[2].children[0].collapsed).toBe(true);
    expect(document.querySelector('#collapse-third-one-1_2_2_0').classList.contains('show')).toBe(
      false
    );
    expect(component.treeview.nodes[2].children[2].children[2].collapsed).toBe(true);
    expect(document.querySelector('#collapse-third-three-1_2_2_2').classList.contains('show')).toBe(
      false
    );
  }));

  it('should disabled list', fakeAsync(() => {
    const toggler = document.querySelector('#collapse-three-1_2').previousSibling as HTMLElement;
    const toggler2 = document.querySelector('#collapse-second-three-1_2_2')
      .previousSibling as HTMLElement;

    expect(component.treeview.nodes[2].disabled).toBe(false || undefined);
    expect(toggler.classList.contains('treeview-disabled')).toBe(false);
    expect(component.treeview.nodes[2].children[2].disabled).toBe(false || undefined);
    expect(toggler2.classList.contains('treeview-disabled')).toBe(false);

    component.data[2].disabled = true;
    component.data[2].children[2].disabled = true;

    component.data = [...component.data];
    fixture.detectChanges();
    flush();

    expect(component.treeview.nodes[2].disabled).toBe(true);
    expect(toggler.classList.contains('treeview-disabled')).toBe(true);
    expect(component.treeview.nodes[2].children[2].disabled).toBe(true);
    expect(toggler2.classList.contains('treeview-disabled')).toBe(true);
  }));

  it('should find and collapse item', fakeAsync(() => {
    const toggler = document.querySelector('#collapse-three-1_2') as HTMLElement;

    expect(toggler.classList.contains('show')).toBe(false);

    component.treeview.filter('Second-two');

    fixture.detectChanges();
    flush();

    expect(toggler.classList.contains('show')).toBe(true);
  }));
});
