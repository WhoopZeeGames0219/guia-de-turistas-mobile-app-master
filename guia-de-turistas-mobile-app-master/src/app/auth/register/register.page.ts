import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(private  authService:  AuthService,
              private  userService:  UserService,
              public loadingController: LoadingController,
              public alertController: AlertController,
              public toast: ToastController,
              private nav: NavController,
              private router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      country: new FormControl(null, [
        Validators.minLength(3)
      ]),
      city: new FormControl(null, [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ]),
      password2: new FormControl(null, [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }

  async onRegister() {
    console.log(this.registerForm.status ,this.registerForm.controls['password'].value,this.registerForm.controls['password2'].value)
    if (this.registerForm.status === 'INVALID' || this.registerForm.controls['password'].value !== this.registerForm.controls['password2'].value) return this.toastError();
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: true,
    });
    await loading.present();

    const email = this.registerForm.controls['email'].value.trim();
    const password = this.registerForm.controls['password'].value.trim();
    const country = this.registerForm.controls['country'].value.trim();
    const city = this.registerForm.controls['city'].value.trim();
    const name = this.registerForm.controls['name'].value.trim();
    try {
      const firebaseUser = await this.authService.registerUser(email, password);
      console.log(firebaseUser);
      const newUser = {uid: firebaseUser.user.uid, email, country, city, name, type: 1}; //type 1 stands for normal buyer user
      await this.userService.addUser(newUser, firebaseUser.user.uid);
      await Preferences.set({key: 'user', value: JSON.stringify(newUser)});
      loading.dismiss();
      await this.nav.navigateRoot('panel');
      return this.onRegisterAlert();
    } catch (e) {
      if(e.code === "auth/email-already-in-use"){
        await this.nav.navigateRoot('login');
        this.emailInUse();
        loading.dismiss()
        return true;
      }
      loading.dismiss()
      console.log(e)
      return this.toastConectionError();
  
    }
  }

  async loginPage(){
    await this.nav.navigateRoot('login');
  }

  async goToPanelPage(){
    this.router.navigate(['/panel']);
  }

  async toastConectionError() {
    const toast = await this.toast.create({
      message: 'Ocurrió un error, vuelve a intentarlo.',
      duration: 3000
    });
    await toast.present();
  }

  async emailInUse() {
    const toast = await this.toast.create({
      message: 'Ese correo ya se encuentra en uso, si no recuerdas tu contraseña selecciona recuperar contraseña.',
      duration: 6000
    });
    await toast.present();
  }
  async toastError() {
    const toast = await this.toast.create({
      message: 'Asegúrate de llenar correctamente todos los campos',
      duration: 3000
    });
    await toast.present();
  }

  async onRegisterAlert() {
    const alert = await this.alertController.create({
      subHeader: '¡Bienvenido a Guia de Turistas!',
      message: '',
      buttons: ['OK']
    });
    return await alert.present();
  }

}
