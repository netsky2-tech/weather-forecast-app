import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentConditions } from './current-conditions';

describe('CurrentConditions', () => {
  let component: CurrentConditions;
  let fixture: ComponentFixture<CurrentConditions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentConditions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentConditions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
