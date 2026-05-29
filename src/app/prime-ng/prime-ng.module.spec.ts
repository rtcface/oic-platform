import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PrimeNgModule } from './prime-ng.module';

@Component({
  template: `<p-tabView></p-tabView><p-table></p-table><p-chart type="pie" [data]="{}"></p-chart>`
})
class DummyComponent {}

describe('PrimeNgModule Exports', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeNgModule],
      declarations: [DummyComponent]
    }).compileComponents();
  });

  it('should compile component that uses TabView, Table, and Chart', () => {
    // This will throw if components are unknown and compileComponents is awaited
    expect(() => TestBed.createComponent(DummyComponent)).not.toThrow();
  });
});
