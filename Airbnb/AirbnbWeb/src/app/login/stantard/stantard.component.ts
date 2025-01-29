import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FirebaseStuffService } from '../../services/firebaseService/firebase-stuff.service';
import { MatDialog } from '@angular/material/dialog';
import { PhoneComponent } from '../phone/phone.component';
import { MatDialogRef } from '@angular/material/dialog';
import { SignupComponent } from '../../signup/signup.component';
import { DarkBackService } from '../../services/back/dark-back.service';

@Component({
  selector: 'app-stantard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './stantard.component.html',
  styleUrl: './stantard.component.css'
})
export class StantardComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, ]),
    password: new FormControl('', [Validators.required])
  });
  
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  constructor( private firebaseStuff : FirebaseStuffService, private router : Router, private dialog : MatDialog, private dialogR: MatDialogRef<StantardComponent>, private darkService : DarkBackService ) { }

  wrong : boolean = false;
  dark : boolean = false;
  background : string = "white";
  color : string = "black";

  submit(){
    if(!this.loginForm.valid){
      return;
    }
    const {email, password} = this.loginForm.value;
    if (email && password) {
      this.firebaseStuff.login(email, password).subscribe(
        () => {
          this.router.navigate(['home']);
          console.log('logged in');
          this.wrong=false;
          this.dialogR.close();
        },
        (error) => {
          this.wrong=true;
          console.log(error);
        }
      );
    }
  }
  ngOnInit(){
    
    this.darkService.dark$.subscribe(dark => {
      this.dark = dark;
      if(this.dark){
        this.background = "black";
        this.color = "white";
      }else{
        this.background = "white";
        this.color = "black";
      }
    });


  }

  redirect(){
    const dialogRef = this.dialog.open(PhoneComponent, {
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

  signUp(){
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

  closeDialog(){
    this.dialogR.close();
  }

}
