import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  userInfo: FormGroup = this.fb.group({
    firstName : ['', [Validators.required,Validators.maxLength(20)]],
    lastName : ['', [Validators.required,Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength (6)]],

  });
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  get email(){
    return this.userInfo.get('email');
  }
  
  get password() {
    return this.userInfo.get('password');
  }

  get firstName(){
    return this.userInfo.get('firstName');
  }


  get lastName(){
    return this.userInfo.get('lastName');
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    try {
      console.log(this.userInfo.value)
      const user = await this.authService.register({
        firstName:this.firstName?.value,
        lastName:this.lastName?.value,
        email:this.email?.value,
        password:this.password?.value
      });
      this.router.navigateByUrl('topics', {replaceUrl: true});

    } catch (error) {
      // this.showAlert('registration failed','please try again');
    } finally {
      await loading.dismiss();
    }

  }
    
  async showAlert (header: string , message: string ) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async navigateToLogin(){
    this.router.navigateByUrl('', {replaceUrl: true})
  }
  

}
