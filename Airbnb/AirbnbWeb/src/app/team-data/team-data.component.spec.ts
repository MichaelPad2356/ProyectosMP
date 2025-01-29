import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamDataComponent } from './team-data.component';

describe('TeamDataComponent', () => {
  let component: TeamDataComponent;
  let fixture: ComponentFixture<TeamDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
