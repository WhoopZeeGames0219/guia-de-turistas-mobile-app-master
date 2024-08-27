import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyPackagesPage } from './my-packages.page';

describe('MyPackagesPage', () => {
  let component: MyPackagesPage;
  let fixture: ComponentFixture<MyPackagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPackagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyPackagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
