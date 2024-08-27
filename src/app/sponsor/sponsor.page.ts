import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { User } from './../../interfaces/user';
import { UserService} from './../services/user.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { LoadingService} from './../services/loading.service'
import { LineChartComponent } from '@swimlane/ngx-charts'
import { Subscription } from 'rxjs';
import { PurchaseService } from '../services/purchase.service';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-sponsor',
  templateUrl: './sponsor.page.html',
  styleUrls: ['./sponsor.page.scss'],
})
export class SponsorPage implements OnInit, OnDestroy {

  @ViewChild('chart') chart: LineChartComponent;

  selectedRestaurantSubscription: Subscription;
  userSubscription: Subscription;

  constructor(  private userService: UserService,
                private alertController: AlertController,
                private purchaseService: PurchaseService,
                private loadingService: LoadingService,
                private nav: NavController) { 


                }

  user: User;
  ipAddress: string;
  restaurantsList = [];
  selectedRestaurant: {name?: string, userId?: string} = {};
  selectedRestaurantUser: any = {};
  selectedfilter = 'week';
  filterText = 'los últimos 7 días';
  filters = [{label: 'Última semana', value: 'week'},
            {label: 'Últimas 4 semanas', value: '4weeks'}, 
            {label: 'Últimos 3 meses', value: '3months'}];
  monthsLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
            'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'] 
  loading: any;
  colorScheme = {
    domain: ['#fcbf49', '#eae2b7', '#d62828']
  };
  graphData = [];
  today = new Date();
  totalValidatedPackages: number = 0;

  async ngOnInit() {

    const user = JSON.parse((await Preferences.get({ key: 'user' })).value);
    if (user.type === 1) {
      this.nav.navigateRoot('panel');
    }
    if (user.type === 2) {
      this.nav.navigateRoot('/scan');
    }
    
    // THis user subscription (just once)
    this.userSubscription = this.userService.$user.pipe(take(1)).subscribe(
      async User => {
        console.log(User, 'Uooohh uooohhh', !Object.keys(User).length)
        if (!Object.keys(User).length) {
          console.log( 'Entró sin llaves, entronces agarramos el usuairio de Storage:')

          const user = JSON.parse((await Preferences.get({ key: 'user' })).value);
          if(user.restaurants){
            this.selectedRestaurant = user.restaurants[0];
            this.restaurantsList = user.restaurants;
            this.userService.getSelectedUser(this.selectedRestaurant.userId);//update Data with subscription
          }
          console.log(user)
          if(!user){
            await this.nav.navigateRoot('/login', {
              animationDirection: 'back'
            });
            return false;
          } 
          console.log(user, 'USUARIOOOOO')
          this.user = user;
          return this.userService.getUser(user.uid); 
        }
        this.user = User;
        if(this.user.restaurants){
            this.selectedRestaurant = this.user.restaurants[0];
            this.restaurantsList = this.user.restaurants;
            this.userService.getSelectedUser(this.selectedRestaurant.userId);//update Data with subscription
          }
        console.log(this.user);
     });


    //  Selected User (Restaurant) subscription
    this.selectedRestaurantSubscription = this.userService.$selectedUser.subscribe( async user =>{
      // this.loading = await this.loadingService.loading();
      // await this.loading.present();
      this.graphData = []
      const tempgraphData = [];
      this.today = new Date();
      this.totalValidatedPackages = 0;
      
      if(user) {
        this.selectedRestaurantUser = user;
      } else{
        return false;
      }
      //WEEK FILTER
      if(this.selectedfilter === 'week'){
        this.filterText = 'los últimos 7 días'

        for (let index = 6; index >= 0; index--) {
          const today = new Date();
          const tempDate = today;
          tempDate.setDate((today.getDate() - index));
          let cont = 0;
          if(this.selectedRestaurantUser.scans){
            for (let index = 0; index < this.selectedRestaurantUser.scans.length; index++) {
              const element = this.selectedRestaurantUser.scans[index];
              if(element.sponsorId !== this.user.id) continue; //jump to next loop
              this.today = new Date();
              console.log(new Date(tempDate).getDate() , new Date(element.date).getDate())
              if (new Date(tempDate).getDate() === new Date(element.date).getDate() &&
              new Date(tempDate).getMonth() === new Date(element.date).getMonth() &&
              new Date(tempDate).getFullYear() === new Date(element.date).getFullYear()) {
                const purchase = await this.purchaseService.getPurchase(element.userId + '/' + element.purchaseId);
                console.log(purchase)
                if(purchase?.quantity){
                  this.totalValidatedPackages =  this.totalValidatedPackages + purchase.quantity;
                  cont = cont + purchase.quantity;
                }   
              }
            }
          }
          tempgraphData.push({name:  + tempDate.getDate() + '/' + (tempDate.getMonth()+1) + '/' + tempDate.getFullYear(), value: cont })
        } 
      }
      //4Weeks Filter
      if(this.selectedfilter === '4weeks'){
        this.filterText = 'las últimas 4 semanas';
        let cont = 0;

        for (let index = 27; index >= 0; index--) {
          const today = new Date();
          const tempDate = today;
          tempDate.setDate((today.getDate() - index));
          if(this.selectedRestaurantUser.scans){
            for (let index = 0; index < this.selectedRestaurantUser.scans.length; index++) {
              const element = this.selectedRestaurantUser.scans[index];
              if(element.sponsorId !== this.user.id) continue; //jump to next loop
              this.today = new Date();
              console.log(new Date(tempDate).getDate() , new Date(element.date).getDate())
              if (new Date(tempDate).getDate() === new Date(element.date).getDate() &&
              new Date(tempDate).getMonth() === new Date(element.date).getMonth() &&
              new Date(tempDate).getFullYear() === new Date(element.date).getFullYear()) {
                const purchase = await this.purchaseService.getPurchase(element.userId + '/' + element.purchaseId);
                console.log(purchase)
                if(purchase?.quantity){
                  this.totalValidatedPackages =  this.totalValidatedPackages + purchase.quantity;
                  cont = cont + purchase.quantity;
                  console.log(purchase.quantity, cont, 'OOHH LALA')
                }   
              }
            }
          }
          //If end of week
          if(index === 20 || index === 13 || index === 6 || index === 0){
            console.log('one week counted', cont, 'total esta semana')
            tempgraphData.push({
              name:
                +tempDate.getDate() +
                "/" +
                (tempDate.getMonth() + 1) +
                "/" +
                tempDate.getFullYear(),
              value: cont,
            });
            //Reset count
            cont = 0;
          }
        } 
      }

      if(this.selectedfilter === '3months'){
        this.filterText = 'los últimos 3 meses';

        for (let index = 2; index >= 0; index--) {
          const today = new Date();
          const tempDate = today;
          tempDate.setMonth((today.getMonth() - index));
          let cont = 0;
          if(this.selectedRestaurantUser.scans){
            for (let index = 0; index < this.selectedRestaurantUser.scans.length; index++) {
              const element = this.selectedRestaurantUser.scans[index];
              if(element.sponsorId !== this.user.id) continue; //jump to next loop
              this.today = new Date();
              console.log(new Date(tempDate).getDate() , new Date(element.date).getDate())
              if (
              new Date(tempDate).getUTCMonth() === new Date(element.date).getUTCMonth()) {
                const purchase = await this.purchaseService.getPurchase(element.userId + '/' + element.purchaseId);
                console.log(purchase)
                if(purchase?.quantity){
                  this.totalValidatedPackages =  this.totalValidatedPackages + purchase.quantity;
                  cont = cont + purchase.quantity;
                }   
              }
            }
          }
          tempgraphData.push({
            name:
              this.monthsLabels[tempDate.getMonth()],
            value: cont
          });        
        } 
      }

      this.graphData = tempgraphData;
      this.chart.update();    
     
      // await this.loadingService.removeLoading(this.loading);
      }) 

     this.chart.gradient = true; 

  }


  restaurantChange(restaurantId: string) {
    for (let index = 0; index < this.restaurantsList.length; index++) {
      console.log(this.restaurantsList[index].userId, restaurantId)
      if(this.restaurantsList[index].userId === restaurantId){
        this.selectedRestaurant = this.restaurantsList[index];
        console.log(this.selectedRestaurant)
        this.userService.getSelectedUser(this.selectedRestaurant.userId);//update Data with subscription
        return;
      }  
    }
  }

  filterChange(filter: string) {
    this.selectedfilter = filter;
    this.userService.getSelectedUser(this.selectedRestaurant.userId);//update Data with subscription
  }

  async ngOnDestroy() {
    
    if(this.selectedRestaurantSubscription) this.selectedRestaurantSubscription.unsubscribe()
    if(this.userSubscription) this.userSubscription.unsubscribe()
    await this.loadingService.removeLoading(this.loading);

  }

}
