import { Injectable } from '@angular/core';
import { FirebaseStuffService } from './firebase-stuff.service';
import { Subscription } from 'rxjs';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private subscription: Subscription;
  name : string;
  email : string;
  phone : string;
  type : string;
  userID : string;

  constructor(private firebaseStuffService: FirebaseStuffService) {
    // Subscribe to currentUser$ observable
    this.subscription = this.firebaseStuffService.currentUser$.subscribe(user => {
      if (user) {
        this.onUserLogin(user);
      } else {
        this.onUserLogout();
      }
    });
    this.name = "";
    this.email = "";
    this.phone = "";
    this.type = "";
    this.userID = "";
  }

  // Perform actions when the user logs in
  private onUserLogin(userA: any) {

    console.log('User logged in:', userA);
    // Add your custom actions here
    this.firebaseStuffService.getUser().subscribe(users => {
      console.log("users: ", users);
      users.forEach(user => {
        if(user.email === userA.email){
          this.name = user.nombre;
          this.email = user.email;
          this.phone = user.telefono;
          this.type = user.tipo;
          this.userID = userA.uid;
          console.log("user found: ");
        }else
          console.log("user not found");
      });
    });
    //this.name = "Robert";
  }

  // Perform actions when the user logs out
  private onUserLogout() {
    console.log('User logged out');
    // Add your custom actions here
    this.name = "";
    this.email = "";
    this.phone = "";
    this.type = "";
    this.userID = "";
    
  }

  // Unsubscribe when the service is destroyed to avoid memory leaks
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
