import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearNVComponent } from './crear-nv.component';

describe('CrearNVComponent', () => {
  let component: CrearNVComponent;
  let fixture: ComponentFixture<CrearNVComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearNVComponent]
    });
    fixture = TestBed.createComponent(CrearNVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
