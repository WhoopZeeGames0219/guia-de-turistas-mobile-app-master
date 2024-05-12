import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import UserCredential = firebase.auth.UserCredential;
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { ToastController } from '@ionic/angular';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user;

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private  userService:  UserService,
              public toast: ToastController,
              ) {
  }

  login(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    this.router.navigate(['/login']);
    return this.afAuth.signOut();
  }

  resetPassword(email) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  registerUser(email, password): Promise<UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async isLoggedIn(): Promise<boolean> {

    const user = JSON.parse((await Preferences.get({ key: 'user' })).value);
    // ADD  && user.emailVerified !== false  ONLY if email verification is implemented
    return (user !== null ) ? true : false;
  }
  
  async eraseAccount(email: string, password: string){
    this.afAuth.signInWithEmailAndPassword(email, password).then(async (user) => {
      await user.user.delete();
      await this.userService.deleteUser(user.user.uid);
      Preferences.remove({ key: "user" });
      const successToast: HTMLIonToastElement = await this.toast.create({
        message: 'Tu cuenta fue eliminada exitosamente',
        duration: 5000,
        color: 'success'
      });
      await successToast.present();
      await this.logout();
    }
    ).catch(async (error) => {
      console.log(error);
      let toast: HTMLIonToastElement = await this.toast.create({
        message: 'Error al eliminar la cuenta. ' + error,
        duration: 5000,
        color: 'danger'
      });
      switch (error.code) {
        case 'auth/wrong-password':
        toast = await this.toast.create({
          message: 'Contraseña incorrecta.',
          duration: 4000
        });
        break
        case 'auth/user-not-found':
        toast = await this.toast.create({
          message: 'Usuario no encontrado.',
          duration: 4000
        });
        break
      }
      await toast.present();
    }
    );
  }
}
