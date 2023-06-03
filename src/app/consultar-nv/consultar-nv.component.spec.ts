import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarNvComponent } from './consultar-nv.component';

describe('ConsultarNvComponent', () => {
  let component: ConsultarNvComponent;
  let fixture: ComponentFixture<ConsultarNvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultarNvComponent]
    });
    fixture = TestBed.createComponent(ConsultarNvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
