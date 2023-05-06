import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api-services/api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  successAlert = false;
  allertMessage: any;
  alert = false;
  isLoading: boolean = false;
  passwordHide = true;

  constructor(private api: ApiService, fb: FormBuilder) {
    this.form = fb.group({
      password: ['', [Validators.required]],
      new_password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  save() {
    if (!this.form.valid) {
      return;
    }
    if (!this.isStrongPassword(this.form.value.new_password)) {
      this.alert = true;
      this.allertMessage = 'Password is weak';
      return;
    }
    this.isLoading = true;

    const path = `auth/change-password`;
    let data = this.form.value;

    this.api.post(path, data).subscribe(
      (response: any) => {
        this.successAlert = true;
        this.allertMessage = response.detail;
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;

        try {
          this.alert = true;
          this.allertMessage = error.error.detail;
        } catch (error) {
          this.alert = true;
          this.allertMessage = 'Network error';
        }
      }
    );
  }
  isStrongPassword(password: string): boolean {
    // Check if password is at least 8 characters long
    if (password.length < 8) {
      return false;
    }

    // Check if password contains at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return false;
    }

    // Check if password contains at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return false;
    }

    // Check if password contains at least one digit
    if (!/[0-9]/.test(password)) {
      return false;
    }

    // Check if password contains at least one special character
    if (!/[!@#$%^&*()\-=_+{}[\]|\\:;"'<>,.?/]/.test(password)) {
      return false;
    }

    // Password passed all checks, considered strong
    return true;
  }
}
