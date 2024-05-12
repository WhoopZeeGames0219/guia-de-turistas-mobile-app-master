import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { BehaviorSubject } from 'rxjs';
import { map } from "rxjs/operators";
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  $user = new BehaviorSubject<any>({});
  $selectedUser = new BehaviorSubject<any>({});

  constructor(private db: AngularFireDatabase) { }

  addUser(user: User, reference){
    return this.db.object('users/'+reference).set(user);
    // return this.db.list('users/'+ reference).push(user);
  }

  updateUser(user: User, reference) {
    return this.db.object('users/' + reference).update(user);
  }

  getSelectedUser(reference: string){ //Same as getUser but subscription is to retrieve another user rather from the logged in
    this.db
      .object("/users/" + reference)
      .snapshotChanges()
      .pipe(
        map((user) => {
          const object = user.payload.val();
          if (object) {
            return object;
          }
          else{
            return {}
          }
        })
      )
      .subscribe((user) => {
        if (!this.$selectedUser) {
          this.$selectedUser = new BehaviorSubject<any>(user);
        } else {
          this.$selectedUser.next(user);
        }
      });
  }

  getUser(reference: string){
    console.log("AVERRR REFERENCe ", reference)

    this.db
      .object("/users/" + reference)
      .snapshotChanges()
      .pipe(
        map((user) => {
          const object = user.payload.val();
          if (object) {
            return object;
          }
          else{
            return {}
          }
        })
      )
      .subscribe((user) => {
        console.log("AVERRR GETUSER ", user)
        if (!this.$user) {
          this.$user = new BehaviorSubject<any>(user);
        } else {
          this.$user.next(user);
        }
      });
  }

  //Get User as a Promise avoiding subscribe()
   getUser2(reference: string): Promise<User>{
    return this.db
      .object("/users/" + reference)
      .valueChanges().toPromise().then((doc: any) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            return doc.data()
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
            return null;
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        return null
    });
      // .pipe(
      //   map((user) => {
      //     const object = user.payload.val();
      //     if (object) {
      //       return object;
      //     }
      //     else{
      //       return {}
      //     }
      //   })
      // )

  }

    //Get User as a Promise avoiding subscribe()
    deleteUser(reference: string): Promise<Boolean>{
      return this.db
        .object("/users/" + reference)
        .remove().then(() => {
          console.log("Document successfully deleted!");
          return true;
      }).catch(function(error) {
          console.error("Error removing document: ", error);
          return false;
      });
    }
}
