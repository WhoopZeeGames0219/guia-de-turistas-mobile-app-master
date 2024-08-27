import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackageQrDetailPage } from './package-qr-detail.page';

describe('PackageQrDetailPage', () => {
  let component: PackageQrDetailPage;
  let fixture: ComponentFixture<PackageQrDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageQrDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackageQrDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
