import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { LoadingService } from "./../services/loading.service";
import { User } from "../../interfaces/user";
import { Purchase } from "../../interfaces/purchase";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Preferences } from "@capacitor/preferences";
import { Package } from "./../../interfaces/package";
import { PackageService } from "./../services/package.service";
import { PurchaseService } from "../services/purchase.service";
import { UserService } from "./../services/user.service";
import { Subscription } from "rxjs";
import { Keyboard } from "@capacitor/keyboard";

declare let Stripe;

@Component({
  selector: "app-stripe-card",
  templateUrl: "./stripe-card.page.html",
  styleUrls: ["./stripe-card.page.scss"],
})
export class StripeCardPage implements OnInit, OnDestroy {
  @ViewChild("content") public content: any;

  stripe = Stripe(environment.stripePublicKey);
  stripePaymentTokenUrl = environment.stripePaymentTokenUrl;
  card: any;
  currencyIcon = "$";
  purchase: Purchase;
  user: User;
  storeUser: any;
  package: Package = {};
  paymentSubscription: Subscription;

  constructor(
    private http: HttpClient,
    public navController: NavController,
    private purchaseService: PurchaseService,
    private packageService: PackageService,
    private userService: UserService,
    private loadingService: LoadingService,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.setupStripe();
    this.storeUser = await JSON.parse(
      (
        await Preferences.get({ key: "user" })
      ).value
    );
    const storePurchase: Purchase = await JSON.parse(
      (
        await Preferences.get({ key: "purchase" })
      ).value
    );
    const storePackage: Package = await JSON.parse(
      (
        await Preferences.get({ key: "selectedPackage" })
      ).value
    );
    console.log(JSON.stringify(storePurchase), JSON.stringify(this.storeUser));
    console.log(storePackage, storePurchase, this.storeUser, 'storePackage, storePurchase, this.storeUser');
    if (storePurchase && this.storeUser && storePackage) {
      //  Move to bottom to see what user is writting
      Keyboard.addListener("keyboardWillShow", (keyboardInfo) => {
        // When keyboard is completely up depending on phone speed response scroll down is activated
        setTimeout(async () => {
          await this.content.scrollToBottom(500);
        }, 600);
        setTimeout(async () => {
          await this.content.scrollToBottom(500);
        }, 1200);
      });
      this.purchase = storePurchase;
      this.package = storePackage;
      this.userService.getUser(this.storeUser.uid);
      this.userService.$user.subscribe((user) => {
        console.log('suscrito a este userrrrrr: ', user)
        this.user = user;
      });
    } else {
      return await this.navController.navigateRoot(["/package-detail"]);
    }
  }

  setupStripe() {
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: "#003049",
        lineHeight: "24px",
        fontFamily:
          '"ProximaNovaRegular", "Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#003049",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };

    this.card = elements.create("card", { style: style });
    console.log(this.card);
    this.card.mount("#card-element");

    this.card.addEventListener("change", (event) => {
      this.content.scrollToBottom(1500);
      var displayError = document.getElementById("card-errors");
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = "";
      }
    });

    this.card.addEventListener("click", (event) => {
      this.content.scrollToBottom(1500);
    });

    var form = document.getElementById("payment-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = document.getElementById("submit-button") as HTMLButtonElement;
      button.disabled = true; // disable the button
      setTimeout(() => {
        button.disabled = false; // enable the button after 8 seconds
      }, 3000);
      const loading = await this.loadingService.loading();
      loading.present();
      if (!this.user.email) {
        loading.dismiss();
        const alert = await this.alertController.create({
          subHeader: "Ups, ocurrió un error",
          message:
            "No se pudo obtener el usuario correctamente. Vuelve a intentarlo o contáctanos al 55 5285 7313.",
          buttons: ["OK"],
        });
        alert.present();
        return await this.navController.navigateRoot(["/package-detail"]);
      }
      //Create card that will be used in the future
      this.stripe
        .createSource(this.card, {
          owner: {
            name: this.user.name,
            email: this.user.email,
          },
        })
        .then(async (result) => {
          if (result.error) {
            var errorElement = document.getElementById("card-errors");
            errorElement.textContent = result.error.message;
            await this.loadingService.removeLoading(loading);
          } else {
            // console.log('Resuuult',result);
            // console.log(JSON.stringify(result));

            //this.makePayment(result.id);
            await this.stripeTokenHandler(result.source.id, loading);

            setTimeout(() => {
              this.loadingService.removeLoading(loading);
            }, 10000);
          }
        });
    });
  }

  async stripeTokenHandler(tokenId, loading) {
    // Insert the token ID into the form so it gets submitted to the server
    // let form = document.getElementById('payment-form');
    // let hiddenInput = document.createElement('input');
    // hiddenInput.setAttribute('type', 'hidden');
    // hiddenInput.setAttribute('name', 'stripeToken');
    // hiddenInput.setAttribute('value', tokenId);
    // let priceInput = document.createElement('input');
    // priceInput.setAttribute('type', 'number');
    // priceInput.setAttribute('name', 'paymentAmount');
    // priceInput.setAttribute('value', this.purchase.price.toString());
    // form.appendChild(hiddenInput);
    // form.appendChild(priceInput);

    console.log(tokenId, "POOO");

    const form = JSON.stringify({
      stripeToken: tokenId,
      paymentAmount: this.purchase.price * 100,
      pakcageName: this.package.name,
    }); //Stripe recieves amount in cents
    console.log(form, "wepaaa");

    await this.updateDataBase();
    console.log('Purchase created!!!!')
    this.paymentSubscription = this.http
      .post<any>(this.stripePaymentTokenUrl, form)
      .subscribe(
        async (session) => {
          //Stripe Session data (use id to show client checkout)
          //After payment succeds:
 
          if(session.paid){
            console.log('Paid purchase: ', this.purchase);
            await this.purchaseService.updatePurchase({ paid: true}, this.storeUser.uid + '/' + this.purchase.id);
            await this.loadingService.removeLoading(loading);
            await this.navController.navigateRoot("/my-packages", {
              animationDirection: "forward",
            });
            const alert = await this.alertController.create({
              subHeader:
                "¡Felicidades!",
              message: "Tu compra se realizó con éxito. Puedes ver tus paquetes en esta sección.",
              buttons: ["Entendido"],
            });
            await alert.present();
          }else{
            await this.loadingService.removeLoading(loading);
            const alert = await this.alertController.create({
              subHeader:
                "¡Ups!",
              message: "Parece que no se pudo efectur el pago, intenta de nuevo o cambia tu método de pago.",
              buttons: ["Entendido"],
            });
            await alert.present();
            throw new Error("Payment failed");
          }
        },
        async (err) => {
          const errorMessage: string = err.error.error.message;
          let alert: HTMLIonAlertElement;

          if(errorMessage.includes('card was declined')){
            alert = await this.alertController.create({
              subHeader:
                "Ups, parece que tu banco no permitió que se efectuara el pago",
              message: "Por favor revisa los datos de tu tarjeta y contacta a tu banco, o intenta con otra tarjeta.",
              buttons: ["Entendido"],
            });
          }
          else {
            alert = await this.alertController.create({
              subHeader:
                "Ups, ocurrió un error. Puedes volver a intentarlo o reportar el error.",
              message: JSON.stringify(err),
              buttons: ["Después", "Reportar por correo"],
            });
          }

          console.log("HTTP Error:", err);
          await alert.present();
          await this.loadingService.removeLoading(loading);
          // check if alert button was clicked and send email with error in it with window emailto
          alert.onDidDismiss().then(async (data) => {
            if (data.role == "Después") {
              return;
            } else {
              window.open(
                `mailto:guiadeturistas.net@gmail.com?subject=Error en pago ${
                  this.user?.email
                }&body=${JSON.stringify(err)}`
              );
            }
            await this.navController.navigateRoot("/panel", {
              animationDirection: "forward",
            });
          });
          alert.present();
        }
      );
  }
  async updateDataBase() {
    console.log("updateDataBaseeeeeee", this.purchase, this.storeUser);
    try {
      const addedPurchase = this.purchaseService.addPurchase(
        this.purchase,
        this.storeUser.uid
      );
      this.purchase.id = addedPurchase.key; //update id of purchase
      if (!this.package.purchases) {
        this.package.purchases = [
          {
            userId: this.storeUser.uid,
            purchaseId: addedPurchase.key,
            reservationDate: this.purchase.reservationDate,
            quantity: this.purchase.quantity,
          },
        ];
      } else {
        this.package.purchases.push({
          userId: this.storeUser.uid,
          purchaseId: addedPurchase.key,
          reservationDate: this.purchase.reservationDate,
          quantity: this.purchase.quantity,
        });
      }

      await this.packageService.updatePackage(this.package, this.package.id);
    } catch (error) {
      console.log(error);
      const alert = await this.alertController.create({
        subHeader:
          "Ups, ocurrió un error. Puedes tomar una captura de pantalla y mandarla a guiadeturistas.net@gmail.com",
        message: JSON.stringify(error),
        buttons: ["OK"],
      });
      alert.onDidDismiss().then(async (data) => {
        if (data.role == "Después") {
          return;
        } else {
          window.open(
            `mailto:guiadeturistas.net@gmail.com?subject=Error en pago ${
              this.user?.email
            }&body=${JSON.stringify(error)}`
          );
        }
        await this.navController.navigateRoot("/panel", {
          animationDirection: "forward",
        });
      });
      alert.present();
    }
  }

  ionViewDidLeave() {
    this.paymentSubscription?.unsubscribe();
    //Remove enevent listener from form submit
    document.getElementById('payment-form').removeEventListener('submit', () => console.log('removed'));
  }

  ngOnDestroy() {
    this.paymentSubscription?.unsubscribe();
  }
}
