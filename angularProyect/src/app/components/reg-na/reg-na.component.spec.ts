import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegNaComponent } from './reg-na.component';

describe('RegNaComponent', () => {
  let component: RegNaComponent;
  let fixture: ComponentFixture<RegNaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegNaComponent]
    });
    fixture = TestBed.createComponent(RegNaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
