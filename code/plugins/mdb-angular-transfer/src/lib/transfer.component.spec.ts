import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MdbTransferComponent } from './transfer.component';
import { MdbTransferModule } from './transfer.module';
import { MdbTransferData } from './transfer.interface';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mdb-test-transfer',
  template: `
    <mdb-transfer
      [dataSource]="dataSource"
      [dataTarget]="dataTarget"
      [pagination]="pagination"
      [oneWay]="oneWay"
      [elementsPerPage]="elementsPerPage"
      [search]="search"
    ></mdb-transfer>
  `,
})
class DefaultTransferComponent {
  @ViewChild(MdbTransferComponent) transfer: MdbTransferComponent;

  dataSource: Array<MdbTransferData> = [
    { data: 'Lorem ipsum' },
    { data: 'Something special' },
    { data: 'John Wick' },
    { data: 'Poland' },
    { data: 'Germany' },
    { data: 'USA' },
    { data: 'China' },
    { data: 'Madagascar' },
    { data: 'Argentina' },
  ];

  dataTarget: Array<MdbTransferData> = [
    { data: 'Russia' },
    { data: 'Australia' },
    { data: 'Hungary' },
    { data: 'France' },
  ];

  pagination = false;
  oneWay = false;
  elementsPerPage = 5;
  search = false;
}

describe('MdbTransferComponent', () => {
  let fixture: ComponentFixture<DefaultTransferComponent>;
  let element: any;
  let component: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultTransferComponent],
      imports: [MdbTransferModule],
    });
    fixture = TestBed.createComponent(DefaultTransferComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should transfer elements', () => {
    component.oneWay = false;
    fixture.detectChanges();

    const firstItemId = element.querySelector(
      `.transfer-source-container .transfer-body .form-check-input`
    ).id;
    const sourceContainer = element.querySelector('.transfer-source-container');
    const targetContainer = element.querySelector('.transfer-target-container');
    const transferToTargetArrow = element.querySelectorAll('.transfer-arrows-arrow')[1];
    const transferToSourceArrow = element.querySelectorAll('.transfer-arrows-arrow')[0];

    expect(sourceContainer.querySelector(`#${firstItemId}`)).not.toBe(null);
    expect(targetContainer.querySelector(`#${firstItemId}`)).toBe(null);

    element.querySelector(`#${firstItemId}`).click();
    transferToTargetArrow.click();
    fixture.detectChanges();

    expect(sourceContainer.querySelector(`#${firstItemId}`)).toBe(null);
    expect(targetContainer.querySelector(`#${firstItemId}`)).not.toBe(null);

    element.querySelector(`#${firstItemId}`).click();
    transferToSourceArrow.click();
    fixture.detectChanges();

    expect(sourceContainer.querySelector(`#${firstItemId}`)).not.toBe(null);
    expect(targetContainer.querySelector(`#${firstItemId}`)).toBe(null);
  });

  it('should select all and unselect all elements', () => {
    fixture.detectChanges();

    const sourceContainer = element.querySelector('.transfer-source-container');
    const selectAllCheckbox = sourceContainer.querySelector(
      '.transfer-header-select-all-container input[type="checkbox"]'
    ) as HTMLInputElement;

    expect(selectAllCheckbox.checked).toBe(false);
    sourceContainer
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox: HTMLInputElement) => {
        expect(checkbox.checked).toBe(false);
      });

    selectAllCheckbox.click();
    fixture.detectChanges();

    expect(selectAllCheckbox.checked).toBe(true);

    sourceContainer
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox: HTMLInputElement) => {
        expect(checkbox.checked).toBe(true);
      });

    selectAllCheckbox.click();
    fixture.detectChanges();

    expect(selectAllCheckbox.checked).toBe(false);

    sourceContainer
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox: HTMLInputElement) => {
        expect(checkbox.checked).toBe(false);
      });
  });

  it('should don`t select disabled elements', () => {
    component.dataSource[0].disabled = true;
    fixture.detectChanges();

    const sourceContainer = element.querySelector('.transfer-source-container');
    const targetContainer = element.querySelector('.transfer-target-container');

    const selectAllCheckbox = sourceContainer.querySelector(
      '.transfer-header-select-all-container input[type="checkbox"]'
    ) as HTMLInputElement;
    const transferToTargetArrow = element.querySelectorAll('.transfer-arrows-arrow')[1];

    const firstSourceItem = sourceContainer.querySelector(`.transfer-body .form-check-input`);
    const firstSourceItemId = firstSourceItem.id;

    expect(firstSourceItem.disabled).toBe(true);
    expect(firstSourceItem.checked).toBe(false);
    expect(selectAllCheckbox.checked).toBe(false);
    expect(sourceContainer.querySelectorAll('.transfer-body-item').length).toBeGreaterThan(1);

    firstSourceItem.click();
    fixture.detectChanges();

    expect(firstSourceItem.checked).toBe(false);

    selectAllCheckbox.click();
    fixture.detectChanges();

    expect(selectAllCheckbox.checked).toBe(true);
    expect(firstSourceItem.checked).toBe(false);

    transferToTargetArrow.click();
    fixture.detectChanges();

    expect(sourceContainer.querySelectorAll('.transfer-body-item').length).toBe(1);
    expect(sourceContainer.querySelector(`#${firstSourceItemId}`)).not.toBe(null);
    expect(targetContainer.querySelector(`#${firstSourceItemId}`)).toBe(null);
  });

  it('should checked element if checked: true', () => {
    component.dataSource[0].checked = true;
    fixture.detectChanges();

    const sourceContainer = element.querySelector('.transfer-source-container');

    const firstSourceItem = sourceContainer.querySelector(`.transfer-body .form-check-input`);

    expect(firstSourceItem.checked).toBe(true);
  });

  it('should checked select all checkbox if all element selected and unselect if all element unselected', () => {
    fixture.detectChanges();

    const sourceContainer = element.querySelector('.transfer-source-container');
    const selectAllCheckbox = sourceContainer.querySelector(
      '.transfer-header-select-all-container input[type="checkbox"]'
    ) as HTMLInputElement;

    expect(selectAllCheckbox.checked).toBe(false);
    sourceContainer
      .querySelectorAll('.transfer-body input[type="checkbox"]')
      .forEach((checkbox: HTMLInputElement) => {
        expect(checkbox.checked).toBe(false);
        checkbox.click();
        expect(checkbox.checked).toBe(true);
      });

    fixture.detectChanges();
    expect(selectAllCheckbox.checked).toBe(true);

    sourceContainer
      .querySelectorAll('.transfer-body input[type="checkbox"]')
      .forEach((checkbox: HTMLInputElement) => {
        checkbox.click();
      });
    fixture.detectChanges();

    expect(selectAllCheckbox.checked).toBe(false);
  });

  it('should set pagination and show only 5 elements', () => {
    component.pagination = false;
    fixture.detectChanges();

    const sourceContainer = element.querySelector('.transfer-source-container');

    let itemsNumber = sourceContainer.querySelectorAll(
      '.transfer-body input[type="checkbox"]'
    ).length;

    expect(itemsNumber).toBe(component.dataSource.length);

    component.pagination = true;
    fixture.detectChanges();
    itemsNumber = sourceContainer.querySelectorAll('.transfer-body input[type="checkbox"]').length;

    expect(itemsNumber).toBe(5);
  });

  it('should set pagination and show only 3 elements', () => {
    component.pagination = false;
    component.elementsPerPage = 3;

    fixture.detectChanges();

    const sourceContainer = element.querySelector('.transfer-source-container');

    let itemsNumber = sourceContainer.querySelectorAll(
      '.transfer-body input[type="checkbox"]'
    ).length;

    expect(itemsNumber).toBe(component.dataSource.length);

    component.pagination = true;
    fixture.detectChanges();
    itemsNumber = sourceContainer.querySelectorAll('.transfer-body input[type="checkbox"]').length;

    expect(itemsNumber).toBe(3);
  });

  it('should transfer one way', () => {
    component.oneWay = true;
    fixture.detectChanges();

    const sourceContainer = element.querySelector('.transfer-source-container');
    const targetContainer = element.querySelector('.transfer-target-container');

    const firstSourceItemId = sourceContainer.querySelector(`.transfer-body .form-check-input`).id;
    const transferToTargetArrow = element.querySelectorAll('.transfer-arrows-arrow')[1];
    const transferToSourceArrow = element.querySelectorAll('.transfer-arrows-arrow')[0];

    expect(sourceContainer.querySelector(`#${firstSourceItemId}`)).not.toBe(null);

    element.querySelector(`#${firstSourceItemId}`).click();
    transferToTargetArrow.click();
    fixture.detectChanges();

    expect(sourceContainer.querySelector(`#${firstSourceItemId}`)).toBe(null);
    expect(targetContainer.querySelector(`#${firstSourceItemId}`)).not.toBe(null);

    element.querySelector(`#${firstSourceItemId}`).click();
    transferToSourceArrow.click();
    fixture.detectChanges();

    expect(sourceContainer.querySelector(`#${firstSourceItemId}`)).toBe(null);
    expect(targetContainer.querySelector(`#${firstSourceItemId}`)).not.toBe(null);
  });

  it('should search elements', () => {
    component.search = true;
    fixture.detectChanges();

    const sourceContainer = element.querySelector('.transfer-source-container');
    const targetContainer = element.querySelector('.transfer-target-container');

    const searchInputSource = sourceContainer.querySelector('.transfer-search-outline input');
    const searchInputTarget = targetContainer.querySelector('.transfer-search-outline input');

    expect(sourceContainer.querySelectorAll('.transfer-body-item').length).toBe(
      component.dataSource.length
    );
    expect(targetContainer.querySelectorAll('.transfer-body-item').length).toBe(
      component.dataTarget.length
    );

    searchInputSource.value = 'lorem';
    searchInputSource.dispatchEvent(new Event('input'));
    searchInputTarget.value = 'australia';
    searchInputTarget.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(sourceContainer.querySelectorAll('.transfer-body-item').length).toBe(1);
    expect(sourceContainer.querySelector('.transfer-body-item label').textContent).toBe(
      ' Lorem ipsum '
    );

    expect(targetContainer.querySelectorAll('.transfer-body-item').length).toBe(1);
    expect(targetContainer.querySelector('.transfer-body-item label').textContent).toBe(
      ' Australia '
    );
  });
});
