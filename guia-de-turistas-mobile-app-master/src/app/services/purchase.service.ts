import { Injectable } from '@angular/core';
import { Purchase } from '../../interfaces/purchase'
import { User } from '../../interfaces/user'
import { BehaviorSubject } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Stripe } from '@ionic-native/stripe/ngx';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  public $selectedPurchase: BehaviorSubject<Purchase>;
  public $purchases: BehaviorSubject<Purchase[]>;
  public $cities: BehaviorSubject<any[]>;
  public $purchase: BehaviorSubject<Purchase>;
  public detailPurchase: Purchase;
  
  constructor(private db: AngularFireDatabase,
              private stripe: Stripe) { 
    this.$selectedPurchase= new BehaviorSubject<Purchase>({});
    this.$purchases = new BehaviorSubject<Purchase[]>(undefined);
    this.$cities = new BehaviorSubject<Purchase[]>(undefined);
    this.stripe.setPublishableKey(environment.stripePublicKey);
  }

  async makePurchase(purchase: Purchase): Promise<boolean>{

    let card = {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 2020,
      cvc: '220'
     }
     
     return this.stripe.createCardToken(card)
        .then(token => {
          console.log(token.id)
          return true;})
        .catch(error => {
          console.error(error);
          return false;
        });
      //Make correct purchase and return true if purchase was successful or false if there was a problem
     
  }


  addPurchase(purchase: Purchase, reference: string) {
    return this.db.list('purchases/' + reference).push(purchase);
  } 

  updatePurchase(purchase: Partial<Purchase>, reference: string) {
    console.log('actualizando compra!', purchase, reference)
    return this.db.object('purchases/' + reference).update(purchase);
  } 
  
  //get a user purchases
  getPurchases(uid) {
    this.db.object('purchases/' + uid).snapshotChanges()
      .pipe(map(purchases => {
        const arr = [];
        const object = purchases.payload.val();
        if (object) {
          Object.keys(object).forEach(key => {
            object[key].id = key;
            arr.push(object[key]);
          });
        }
        return arr;
      }))
      .subscribe((purchases) => {
        if (!this.$purchases) {
          this.$purchases = new BehaviorSubject<Purchase[]>(purchases);
        } else {
          this.$purchases.next(purchases);
        }
      });
  }

  setPurchase(reference: string) {
    this.db.object('purchases/' + reference).snapshotChanges()
      .pipe(map((purchase: any) => {
        return {...purchase.payload.val(), id: purchase.key};
      }))
      .subscribe(async p => {
        this.$selectedPurchase.next(p);
      });
  }
  async getPurchase(reference: string): Promise<Purchase> {
    return this.db.object('purchases/' + reference).valueChanges().pipe(take(1)).toPromise().then((doc: any) => {
      if (doc) {
          // console.log("Document dataaaaaaaaaaa:", doc);
          return doc as Purchase;
      } else {
          console.log("No such document!");
          return null;
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
      return null
  });
  }


  getDetailPurchase(): Purchase {
    return this.detailPurchase;
  }

  setDetailPurchase(purchase: Purchase) {
    this.detailPurchase = purchase;
  }

}
