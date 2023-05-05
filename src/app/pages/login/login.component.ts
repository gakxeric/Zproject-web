import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from 'src/app/api-services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  today = new Date();
  passwordHide = true;
  usernameForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  isLoading = false;
  alert = false;
  successAlert = false;
  allertMessage:any;
age: number = 0
  currenctStep: number = 0;

  usingMagincLinkAuth: boolean = false;
  magicLinkSent: boolean = false;

  emailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private datePipe: DatePipe
  ) {
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required]],
    });

    this.otpForm = this.fb.group({
      code: ['', [Validators.required]],
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]],
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    const profile = JSON.parse(
      window.sessionStorage.getItem('profile') as string
    );
    this.age = this.today.getFullYear() - profile.birthdate.getFullYear()

    if (profile != null && profile != undefined) {
      this.router.navigate(['/dashboard/profile']);
    }
  }

  get otpControl(): FormControl {
    return this.otpForm.get('code') as FormControl;
  }

  disableForm() {
    // this.loginForm.get('username')?.disable();
    // this.loginForm.get('password')?.disable();
  }

  enableForm() {
    // this.loginForm.get('username')?.enable();
    // this.loginForm.get('password')?.enable();
  }



  goToNextStep(): void {
    switch (this.currenctStep) {
      case 0:
        this.requestOtp();
        break;

      case 1:
        this.verifyOtp();
        break;

      case 2:
        this.login();
        break;

      default:
        break;
    }
  }

  getMagicLink(): void {
    if (!this.emailForm.valid) {
      return;
    }

    this.isLoading = true;

    const data = this.emailForm.value;

    this.api.post('auth/generate-magic-link', data).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.magicLinkSent = true;
      },
      (error: any) => {
        console.log(error);
        this.isLoading = false;

        try {
          this.alert =true
          this.allertMessage=error.detail
          
        } catch (error) {
          this.alert =true
          this.allertMessage='Network error'
        }
      }
    );
  }

  requestOtp(): void {
    if (!this.usernameForm.valid) {
      return;
    }

    this.isLoading = true;

    const data = this.usernameForm.value;

    this.api.post('auth/request-verification-code', data).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.successAlert=true
        this.allertMessage=response.detail
        this.next();
      },
      (error: any) => {
        console.log(error);
        this.isLoading = false;

        try {
          this.alert =true
          this.allertMessage=error.detail
          
        } catch (error) {
          this.alert =true
          this.allertMessage='Network error'
        }
      }
    );
  }

  verifyOtp(): void {
    if (!this.otpForm.valid) {
      return;
    }

    this.isLoading = true;

    const data = {
      ...this.usernameForm.value,
      ...this.otpForm.value,
    };
   

    this.api.post('auth/verify-otp', data).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.next();
      },
      (error: HttpErrorResponse) => {
        console.log(error);
        this.isLoading = false;

        try {
          this.alert =true
          this.allertMessage=error.error.detail
          
        } catch (error) {
          this.alert =true
          this.allertMessage='Network error'
        }
      }
    );
  }

  login() {
    if (!this.passwordForm.valid) {
      return;
    }

    this.isLoading = true;

    const data = {
      ...this.usernameForm.value,
      ...this.otpForm.value,
      ...this.passwordForm.value,
    };

    this.api.post('auth/authenticate', data).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.next();
        window.sessionStorage.setItem('profile', JSON.stringify(response));
        this.api.reInit();
        this.router.navigate(['/dashboard']);
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;

        try {
          this.alert =true
          this.allertMessage=error.error.detail
          
        } catch (error) {
          this.alert =true
          this.allertMessage='Network error'
        }
      }
    );
  }
  next(){
    this.currenctStep +=1
    this.successAlert=false
  }
}
