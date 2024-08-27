import { Injectable } from "@angular/core";
import { Package } from "../../interfaces/package";
import { BehaviorSubject, Observable } from "rxjs";
import { AngularFireDatabase } from "@angular/fire/database";
import { map } from "rxjs/operators";
import { Preferences } from '@capacitor/preferences';



@Injectable({
  providedIn: "root",
})
export class PackageService {
  $selectedPackage: BehaviorSubject<Package>;
  $packages: BehaviorSubject<Package[]>;
  $cities: BehaviorSubject<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.$selectedPackage = new BehaviorSubject<Package>({});
    this.$packages = new BehaviorSubject<Package[]>(undefined);
    this.$cities = new BehaviorSubject<Package[]>(undefined);
  }
  private dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
];
  setPackage(reference: string) {
    this.db
      .object("packages/" + reference)
      .snapshotChanges()
      .pipe(
        map((pack: any) => {
          return { ...pack.payload.val(), id: pack.key };
        })
      )
      .subscribe(async (p) => {
        this.$selectedPackage.next(p);
      });
  }

  async resetPackage() {
    this.$selectedPackage.next({});
    await Preferences.remove({ key: "selectedPackage" });
  }

  // getTenNextFilteredPackages(nextIndex: number, city?: string, ){
  //   let ref = this.db.database.
  //   return this.db.list('/packages', ref =>
  //   ref.limitToFirst(nextIndex)).snapshotChanges()
  //   .pipe(map(packages => {
  //     const arr = [];
  //     const object = packages;
  //     if (object) {
  //       Object.keys(object).forEach(key => {
  //         object[key].id = key;
  //         arr.push(object[key].payload.val());
  //       });
  //     }
  //     return arr;
  //   })).subscribe((packages) => {
  //     if (!this.$packages) {
  //       this.$packages = new BehaviorSubject<Package[]>(packages);
  //     } else {
  //       this.$packages.next(packages);
  //     }
  //   });
  // }

  // if(city) {
  //   ref = ref.where('colour', '==', colourValue);
  // }
  // if(brandValue) {
  //   ref = ref.where('brand', '==', brandValue);
  // }

  getCityFilters() {
    this.db
      .object("/cities")
      .snapshotChanges()
      .pipe(
        map((cities) => {
          const arr = [];
          const object = cities.payload.val();
          if (object) {
            Object.keys(object).forEach((key) => {
              object[key] = key;
              arr.push(object[key]);
            });
          }
          return arr;
        })
      )
      .subscribe((cities) => {
        if (!this.$cities) {
          this.$cities = new BehaviorSubject<any[]>(cities);
        } else {
          this.$cities.next(cities);
        }
      });
  }


//date in YYY-MM-DD format
  getFilterPackages(nextIndex: number, city: string, date?: string) {
    // console.log('This is the Date!!!', date);
    return this.db
      .list("/packages", (ref) =>
        ref.orderByChild("city").equalTo(city).limitToFirst(nextIndex)
      )
      .snapshotChanges()
      .pipe(
        map((packages) => {
          const arr = [];
          const object = packages;
          if (object) {
            if (date){
              const formatedDate = new Date(Number(date.split('-')[0]), Number(date.split('-')[1])-1, Number(date.split('-')[2]) );
              

              Object.keys(object).forEach((key) => {
                console.log('Día!:' , this.dayNames[formatedDate.getDay()]);
                console.log('Disponibilidad por día de la semana!:' , object[key].payload.val().weekDaysAvailable[this.dayNames[formatedDate.getDay()]])

                if( !object[key].payload.val().weekDaysAvailable[this.dayNames[formatedDate.getDay()]]) return; //If that week day is false (not available) don´t push to array
                //If Available in selected date then push to array
                if(this.calculateAvailable(date, object[key].payload.val()) > 0){
                  arr.push({ ...object[key].payload.val(), id: object[key].key });
                }
              });
            } else {
              Object.keys(object).forEach((key) => {
                // console.log(object[key].payload.val(), 'VAAALLLL')

                //If Available in selected date then push to array
                  arr.push({ ...object[key].payload.val(), id: object[key].key });
              });
            }
          }
          return arr;
        })
      )
      .subscribe((packages) => {
        if (!this.$packages) {
          this.$packages = new BehaviorSubject<Package[]>(packages);
        } else {
          this.$packages.next(packages);
        }
      });
  }

  calculateAvailable(date: string, pack: Package): number{
    if( pack.purchases && pack.purchases.length > 0){
      let count = 0; //counter which will substract the total per day
      for (let index = 0; index < pack.purchases.length; index++) {
        if(date === pack.purchases[index].reservationDate){
          count = pack.purchases[index].quantity + count;
        }
    }
    const available = pack.totalPerDay - count;

    return available;
    } else{
      return pack.totalPerDay;
    }
  }

  getPackages() {
    this.db
      .object("/packages")
      .snapshotChanges()
      .pipe(
        map((packages) => {
          const arr = [];
          const object = packages.payload.val();
          if (object) {
            Object.keys(object).forEach((key) => {
              object[key].id = key;
              arr.push(object[key]);
            });
          }
          return arr;
        })
      )
      .subscribe((packages) => {
        if (!this.$packages) {
          this.$packages = new BehaviorSubject<Package[]>(packages);
        } else {
          this.$packages.next(packages);
        }
      });
  }

  getSinglePackage(reference: string): Observable<Package> {
    return this.db
      .object("/packages/" + reference)
      .snapshotChanges()
      .pipe(
        map((pack: any) => {
          return { ...pack.payload.val(), id: pack.key } as Package;
        })
      );
  }

  updatePackage(pack: Package, reference: string) {
    return this.db.object("packages/" + reference).update(pack);
  }

}
