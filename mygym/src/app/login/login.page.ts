import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import {AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength (6)]],
  });
  
  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
    ) {}
    
    get email(){
      return this.credentials.get('email');
    }
    
    get password() {
      return this.credentials.get('password');
    }
    ngOnInit() {
      
    }
    
    
    async login() {
      const loading = await this.loadingController.create();
      await loading.present();
      
      const user = await this.authService.login(this.credentials.value);
      await loading.dismiss();
      
      if(user){
        this.router.navigateByUrl('topics', {replaceUrl: true});
      }else{
        this.showAlert('login failed','please try again')
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

    async navigateToRegister() {
      this.router.navigateByUrl('registration', {replaceUrl: true});
    }
    
  }
  