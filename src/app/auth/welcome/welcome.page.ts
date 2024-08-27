import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController } from '@ionic/angular';
import { LoadingService } from 'src/app/services/loading.service';
import { Preferences } from '@capacitor/preferences';



@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(
    private loadingService: LoadingService,
    public sanitizer: DomSanitizer,
    public navController: NavController,
  ) { }

  loading: any;
  sanitizedUrl: any;
  buttonAppear = false;

  async ngOnInit() {

    const introVideo = (await Preferences.get({ key: "introVideo" })).value
    console.log(introVideo);
    if(introVideo === "true"){
      if (this.loading) {
        await this.loadingService.removeLoading(this.loading);
      }
      return await this.navController.navigateRoot(["/panel"]);
    }
   
    setTimeout(() => {
      this.buttonAppear = true;
    }, 6000);
  }


  async navigateToPanel(){
    return await this.navController.navigateRoot(["/panel"]);
  }
 
    //Stop charging spinner when video is loaded
  async handleIFrameLoadEvent() {
    console.log('Stopped charging!!!')
    if (this.loading) {
      await this.loadingService.removeLoading(this.loading);
    }
    await Preferences.set({ key: "introVideo" , value: "true"});
  }

  async ionViewDidEnter() {
    const introVideo = (await Preferences.get({ key: "introVideo" })).value
    if(introVideo === "true") return
    //Charge video 
    const url = 'https://www.youtube.com/watch?v=YwMdMN6bi6U'.replace("watch?v=", "embed/");;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    console.log(this.sanitizedUrl)
    this.loading = await this.loadingService.loading();
    await this.loading.present();
  }
  
}
