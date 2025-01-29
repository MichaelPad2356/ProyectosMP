import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import "@angular/fire/firestore"
import "@angular/fire/app"
import "@angular/fire/auth"
import { Auth, signInWithPhoneNumber } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirebaseStuffService } from '../../services/firebaseService/firebase-stuff.service';
import  User from "../../interfaces/user"
import { Router } from '@angular/router';
import { RecaptchaVerifier, getAuth } from 'firebase/auth';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { SignupComponent } from '../../signup/signup.component';


@Component({
  selector: 'app-phone',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.css'
})
export class PhoneComponent {

  reCaptchaVerifier !: RecaptchaVerifier;
  auth = getAuth();
  user : any;
  confirmation : boolean = false;
  smsResult : any;
  phoneA : string = "";
  users : User[];
  solved : boolean = false;
  sent : boolean = false;

  constructor(private firebaseStuff : FirebaseStuffService, private router : Router, private dialog : MatDialog, private dialogR: MatDialogRef<PhoneComponent>) {
    this.users = [{email: "", nombre: "", telefono: "", tipo: "", userID: ""}]
  }


  loginForm = new FormGroup({
    phone: new FormControl('', [Validators.required]),
    otp : new FormControl('')
  });

  get phone() {
    return this.loginForm.get('phone');
  }

  get otp(){
    return this.loginForm.get('otp');
  }

  ngOnInit(): void {
    console.log('Phone component initialized');
    this.firebaseStuff.getUser().subscribe(users => {
      this.users = users;
    });
  }

  redirectBack(){
    const dialogRef = this.dialog.open(SignupComponent, {
      maxWidth: '90vw',
      width: '30%',
      maxHeight: '90vh',
      height: 'auto',
      panelClass: 'phone-dialog',
      autoFocus: false,
    });
    console.log("phone opened");

    this.dialogR.close();

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  submit(){
    if(!this.loginForm.valid){
      console.log('Form is invalid');
      return;
    }
    console.log('Form is valid');
    
    const {phone} = this.loginForm.value;
   
    if( phone){
      console.log("calling generate captcha");
      this.generateCaptcha(phone);
    }else{
      console.error('One of the values in the form was null ');
    }
  }

  generateCaptcha(phoneNumber : any){
    try {
      this.reCaptchaVerifier = new RecaptchaVerifier(getAuth(), 'recaptcha-container', {
        size: 'normal',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          this.solved = true;
          return response;
        },
      });
      console.log('ReCaptchaVerifier initialized successfully');
    } catch (error:any) {
      console.error('Error generating captcha', error.message);
    }
    console.log('About to log user in with his phone number - phoneComp,generateCaptcha');
    
    if(this.phoneExists(phoneNumber)){ //phone exists
      signInWithPhoneNumber(getAuth(), "+52"+phoneNumber, this.reCaptchaVerifier).then(
        (smsResult) => {
          console.log('OTP sent');
          this.smsResult = smsResult;
          this.confirmation = true;
        }
      ).then(
        ( ) => {
          console.log("user logged in with his phone number");
          
        }
      ).catch(
        (error) => {
          console.error('Error sending OTP', error);
        }
      )
    }else{
      console.error('Phone number does not exist');
      //change the content of the page to show that the phone number does not exist 
    }
  }

  submit2(){
    this.verifyOTP(this.otp?.value);
  }

  //called when the user enters the code sent to his phone
  verifyOTP(value:any){
    if(this.smsResult != undefined){
      this.smsResult.confirm(value).then(
        (object : { user: any;} ) => {
          console.log('User signed up with his phone number');
          this.user = object.user;
          var currentUser = this.auth.currentUser;
          this.router.navigate(['/home']);
          this.dialogR.close();
        }
        
      )
    }
  }

  phoneExists(phoneNumber:string) :boolean{
    for(let us of this.users){
      if(us.telefono == this.phone?.value){
        return true;
      }
    }
    return false;
  }

  closeDialog(){
    this.dialogR.close();
  }

  

}
