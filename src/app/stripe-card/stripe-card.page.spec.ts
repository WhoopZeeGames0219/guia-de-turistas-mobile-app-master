import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StripeCardPage } from './stripe-card.page';

describe('StripeCardPage', () => {
  let component: StripeCardPage;
  let fixture: ComponentFixture<StripeCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StripeCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
