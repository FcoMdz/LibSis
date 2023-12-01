import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsNotaApartadoComponent } from './cons-nota-apartado.component';

describe('ConsNotaApartadoComponent', () => {
  let component: ConsNotaApartadoComponent;
  let fixture: ComponentFixture<ConsNotaApartadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsNotaApartadoComponent]
    });
    fixture = TestBed.createComponent(ConsNotaApartadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
