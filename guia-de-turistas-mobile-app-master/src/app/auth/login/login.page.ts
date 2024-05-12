import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Preferences } from '@capacitor/preferences';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit, OnDestroy {

  loginForm: FormGroup;
  passwordVisible = false;
  userSubscription: Subscription;

  constructor(private  authService:  AuthService,
              private  userService:  UserService,
              public loadingController: LoadingController,
              public alertController: AlertController,
              public toast: ToastController,
              private nav: NavController,
              private router: Router) { }

              
  ngOnInit() {
   this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }

  async onLogin(){
    if (this.loginForm.status === 'INVALID') return this.toastError();

    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: true,
    });

    const email = this.loginForm.controls['email'].value.trim();
    const password = this.loginForm.controls['password'].value.trim();

    try {
      await loading.present();
      const firebaseUser = await this.authService.login(email, password);
      // console.log(user);
      try {
         console.log(firebaseUser.user.uid);
          this.userService.getUser(firebaseUser.user.uid);
          this.userSubscription = this.userService.$user.subscribe(
            async User => {
              const user = User;
              console.log(JSON.stringify(user))
              Preferences.set({key: 'user', value: JSON.stringify(user)});
              this.authService.user = user;
              await loading.dismiss();
              switch (user.type) {
                case 1:
                  this.nav.navigateRoot('panel');
                  break;
                case 2:
                  this.nav.navigateRoot('scan');
                  break;
                case 3:
                    this.nav.navigateRoot('sponsor');
                  break;
              }
           }
         );

      } catch (error) {
        await this.onLoginError('Ocurrió un error, vuelve a intentarlo más tarde.');
        console.log(error);
      }
       
    } catch (e) {
      console.log(e);
      //if (e.code === 'auth/wrong-password') this.passwordResetCounter++;
      await loading.dismiss();
      await this.onLoginError('Correo o contraseña inválidos');
    }
  }

  togglePasswordVisible() {
    this.passwordVisible = !this.passwordVisible;
  }

  async registerPage(){
    await this.nav.navigateRoot('register');
  }

  async goToPanelPage(){
    this.router.navigate(['/panel']);
  }

  async onResetAccount() {
    const email = this.loginForm.controls['email'].value;
    const alert = await this.alertController.create({
      header: 'Reestablecer contraseña',
      message: `¿Reestablecer acceso para ${email}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Continuar',
          handler: () => {
            this.authService.resetPassword(email)
              .then(() => {
                this.onResetAlert().then();
              });
          }
        }
      ]
    });
    await alert.present();
  }

  //Toasts
  async toastError() {
    const toast = await this.toast.create({
      message: 'Asegúrate de llenar correctamente todos los campos',
      duration: 3000
    });
    await toast.present();
  }

  async onResetAlert() {
    const alert = await this.alertController.create({
      subHeader: 'Recuperar contraseña',
      message: 'Se te envió un mensaje a tu dirección de correo con los pasos a seguir para recuperar la cuenta.',
      buttons: ['OK']
    });
    return await alert.present();
  }
  async onLoginError(message) {
    const alert = await this.alertController.create({
      subHeader: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  ngOnDestroy(){
    this.userSubscription?.unsubscribe();
  }

}
