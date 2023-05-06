import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinAuthComponent } from './lin-auth.component';

describe('LinAuthComponent', () => {
  let component: LinAuthComponent;
  let fixture: ComponentFixture<LinAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
