import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProvComponent } from './crear-prov.component';

describe('CrearProvComponent', () => {
  let component: CrearProvComponent;
  let fixture: ComponentFixture<CrearProvComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearProvComponent]
    });
    fixture = TestBed.createComponent(CrearProvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
