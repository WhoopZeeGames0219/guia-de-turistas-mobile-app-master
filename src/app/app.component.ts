import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Platform, NavController, ModalController, AlertController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { Preferences } from '@capacitor/preferences';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Splash } from "./splash/splash.page"
import { User } from "firebase";


@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    
  ];
  public StorageUser: any = {};
  
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private nav: NavController,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {
    this.initializeApp();
    Preferences.get({ key: "user" }).then((user) => {
      console.log("init app");

      if (user) {
        this.StorageUser = JSON.parse(user.value);
        this.authService.user = this.StorageUser;
        console.log(this.StorageUser)
       
      } else {
        // redirect to login
        //this.nav.navigateRoot("login");
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      StatusBar.setStyle({style: Style.Light})
      const splash = await this.modalCtrl.create({component: Splash });
      splash.present();
      // this.splashScreen.hide(); //Remove for custom animated splash screen
    });

  
  }

  ngOnInit() {
    console.log('Im in ngOnInit')
    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
    this.appPages = [{
      title: "Panel principal",
      url: "/panel",
      icon: "grid",
    },
    {
      title: "Mis Compras",
      url: "/my-packages",
      icon: "qr-code",
    },
    {
      title: "Políticas de privacidad",
      url: "/privacy-politics",
      icon: "lock-closed",
    },
    // {
    //   title: "Q&A",
    //   url: "/questions",
    //   icon: "help-circle",
    // }
  ]
    setTimeout(() => {
      if(!this.StorageUser) return;
      if(this.StorageUser.type === 2){
        this.appPages = [{
          title: "Escanear",
          url: "/scan",
          icon: "scan",
        }]
      }
      if(this.StorageUser.type === 3){
        this.appPages = [{
          title: "Gráficas",
          url: "/sponsor",
          icon: "analytics",
        }]
      }
    }, 3000);
   
  }

  splitPaneVisible(event: any){
    this.appPages = [{
      title: "Panel principal",
      url: "/panel",
      icon: "grid",
    },
    {
      title: "Mis Compras",
      url: "/my-packages",
      icon: "qr-code",
    },
    {
      title: "Políticas de privacidad",
      url: "/privacy-politics",
      icon: "lock-closed",
    }
    // {
    //   title: "Q&A",
    //   url: "/questions",
    //   icon: "help-circle",
    // }
  ]
  Preferences.get({ key: "user" }).then((user) => {
      console.log("init app");

      if (user) {
        this.StorageUser = JSON.parse(user.value);
        console.log(this.StorageUser)
        this.authService.user = this.StorageUser;
      }
        if(!this.StorageUser) return; //Leave default
        if(this.StorageUser.type === 2){
          this.appPages = [{
            title: "Escanear",
            url: "/scan",
            icon: "scan",
          }]
        }
        if(this.StorageUser.type === 3){
          this.appPages = [{
            title: "Gráficas",
            url: "/sponsor",
            icon: "analytics",
          }]
        }
    });
  }

  async goToVideoTutorial(){
    await Preferences.set({ key: "introVideo" , value: "false"});
    return await this.
    nav.navigateForward("/", {
      animationDirection: "forward",
    });
  }

  async goToWhatsApp(){
    window.open("https://wa.me/525535650215", "_system");
  }

  logout() {
    Preferences.remove({ key: "user" });
    this.authService.logout();
  }

  async eraseAccount() {
    const deleteAccountAlert = await this.alertController.create({
      header: "¿Estás seguro?",
      message: "¿Estás seguro de que quieres borrar tu cuenta? Si lo haces, no podrás volver a acceder a tu cuenta y todos sus datos se perderán.",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Borrar",
          handler: async () => {
            await confirmAccountDeletion.present();
          }
        }
      ]
    });
    const confirmAccountDeletion = await this.alertController.create({
      header: "Ingresa tu contraseña para continuar.",
      inputs: [
        {
          name: "password",
          type: "password",
          placeholder: "Contraseña",
        },
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Borrar",
          handler: (data) => {
            this.authService.eraseAccount(this.StorageUser.email, data.password);
          }
        }
      ]
    });
    await deleteAccountAlert.present();
    // window.open('mailto:' + 'guiadeturistas.net@gmail.com' + '?&subject=Eliminación de datos' + '&body=Deseo eliminar mi cuenta de Guía de Turistas porque ', '_self');
  }
  
  closeScanCamera(){
    //Styles which are applied to the body when the camera is open
    document.body.classList.remove("qrscanner");
  }

  goToLogin(){
    this.nav.navigateRoot("login");
  }
}
