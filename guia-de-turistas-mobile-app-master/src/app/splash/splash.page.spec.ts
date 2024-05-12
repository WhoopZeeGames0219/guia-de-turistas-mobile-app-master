import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Splash } from './splash.page';

describe('SplashPage', () => {
  let component: Splash;
  let fixture: ComponentFixture<Splash>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Splash ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Splash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
