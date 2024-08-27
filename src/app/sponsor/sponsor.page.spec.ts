import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SponsorPage } from './sponsor.page';

describe('SponsorPage', () => {
  let component: SponsorPage;
  let fixture: ComponentFixture<SponsorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SponsorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
