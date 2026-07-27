import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAchievementsComponent } from './shared-achievements.component';

describe('SharedAchievementsComponent', () => {
  let component: SharedAchievementsComponent;
  let fixture: ComponentFixture<SharedAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedAchievementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
