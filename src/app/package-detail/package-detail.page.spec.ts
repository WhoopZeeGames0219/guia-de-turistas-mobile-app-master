import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackageDetailPage } from './package-detail.page';

describe('PackageDetailPage', () => {
  let component: PackageDetailPage;
  let fixture: ComponentFixture<PackageDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackageDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
