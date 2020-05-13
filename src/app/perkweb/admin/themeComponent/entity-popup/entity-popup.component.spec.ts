import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityPopupComponent } from './entity-popup.component';

describe('EntityPopupComponent', () => {
  let component: EntityPopupComponent;
  let fixture: ComponentFixture<EntityPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
