import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MdbTableModule } from './table.module';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbTableDirective } from './table.directive';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { FormsModule } from '@angular/forms';

import { By } from '@angular/platform-browser';

@Component({
  selector: 'mdb-table-test',
  template: `
    <mdb-form-control>
      <input
        mdbInput
        type="text"
        id="form1"
        class="form-control"
        [(ngModel)]="searchText"
        id="search-input"
      />
      <label mdbLabel class="form-label" for="form1">Search</label>
    </mdb-form-control>
    <div class="datatable mt-4">
      <table
        class="table datatable-table"
        mdbTable
        mdbTableSort
        #table="mdbTable"
        #sort="mdbTableSort"
      >
        <thead class="datatable-header">
          <tr>
            <th scope="col">
              <div class="form-check d-flex align-items-center mb-0">
                <input
                  mdbCheckbox
                  class="datatable-header-checkbox form-check-input"
                  type="checkbox"
                />
              </div>
            </th>
            <th
              *ngFor="let head of headElements; let i = index"
              [mdbTableSortHeader]="head"
              scope="col"
              class="th-sm"
            >
              {{ head | titlecase }}
            </th>
          </tr>
        </thead>
        <tbody #row class="datatable-body">
          <tr *ngFor="let el of table.data; let i = index" (click)="onRowClick($event, i)">
            <td data-mdb-field="checkbox">
              <div class="form-check">
                <input
                  mdbCheckbox
                  (click)="returnIndex(i)"
                  data-mdb-row-index="2"
                  class="datatable-row-checkbox form-check-input"
                  type="checkbox"
                />
              </div>
            </td>
            <td scope="row">
              {{ el.name }}
            </td>
            <td class="red-text">
              {{ el.position }}
            </td>
            <td>
              {{ el.office }}
            </td>
            <td>
              {{ el.age }}
            </td>
            <td>
              {{ el.startDate }}
            </td>
            <td>
              {{ el.salary }}
            </td>
            <td>
              <button
                class="call-btn btn btn-outline-primary btn-floating btn-sm"
                (click)="onBtnClick()"
              >
                <i class="fa fa-phone"></i>
              </button>
              <button
                class="messhandle-btn btn ms-2 btn-primary btn-floating btn-sm"
                (click)="onBtnClick()"
              >
                <i class="fa fa-envelope"></i>
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot class="grey lighten-5 w-100">
          <tr>
            <td colspan="4">
              <mdb-table-pagination paginationAlign=""></mdb-table-pagination>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  `,
})
class TestTableComponent {
  @ViewChild(MdbTableDirective) _table: MdbTableDirective<any>;

  elements: any = [
    {
      id: 0,
      name: 'Tiger Nixon',
      position: 'System Architect',
      office: 'Edinburgh',
      age: 61,
      startDate: '2011/04/25',
      salary: '$320,800',
    },
    {
      id: 1,
      name: 'Sonya Frost',
      position: 'Software Engineer',
      office: 'Edinburgh',
      age: 23,
      startDate: '2008/12/13',
      salary: '$103,600',
    },
    {
      id: 2,
      name: 'Jena Gaines',
      position: 'Office Manager',
      office: 'London',
      age: 30,
      startDate: '2008/12/19',
      salary: '$90,560',
    },
    {
      id: 3,
      name: 'Quinn Flynn',
      position: 'Support Lead',
      office: 'Edinburgh',
      age: 22,
      startDate: '2013/03/03',
      salary: '$342,000',
    },
    {
      id: 4,
      name: 'Charde Marshall',
      position: 'Regional Director',
      office: 'San Francisco',
      age: 36,
      startDate: '2008/10/16',
      salary: '$470,600',
    },
  ];
}

describe('MDB Table', () => {
  let fixture: ComponentFixture<TestTableComponent>;
  let component: any;
  let mdbTable: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTableComponent],
      imports: [MdbTableModule, MdbCheckboxModule, MdbFormsModule, FormsModule],
      teardown: { destroyAfterEach: false },
    });

    fixture = TestBed.createComponent(TestTableComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;
    mdbTable = fixture.debugElement.query(By.css('.table'));
  });

  it('should generate table', fakeAsync(() => {
    fixture.detectChanges();

    // expect(mdbTable.nativeElement.querySelectorAll('td')).toBe(false);
  }));
});
