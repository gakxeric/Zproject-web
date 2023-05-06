import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api-services/api.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {
  editing = false;
  data: any;
  user: any = JSON.parse(window.sessionStorage.getItem('profile') as string);
  form: FormGroup;
  isLoading = false;
  successAlert = false;
  allertMessage: any;
  file: any;
  today = new Date();
  formData: FormData = new FormData();
  alert = false;
  age: number = 0;
  constructor(private api: ApiService, fb: FormBuilder) {
    this.form = fb.group({
      nid_number: [
        this.user?.nid_number ? this.user?.nid_number : '',
        [Validators.required],
      ],
    });
  }

  ngOnInit(): void {}

  onFileSelectionChange($event: any): void {
    if ($event.target.files && ($event.target.files[0] as File)) {
      this.file = $event.target.files[0] as File;

      this.formData.append('nid_document', this.file);
    }
  }

  verify(): void {
    if (!this.form.valid || !this.file) {
      return;
    }

    this.isLoading = true;
    this.formData.append('nid_number', this.form.value.nid_number);

    this.api
      .postFormData(
        'verifications/upload-verification-documents',
        this.formData
      )
      .subscribe(
        (response: any) => {
          this.editing = false;
          this.user['verification_status'] = 'PENDING VERIFICATION';
          window.sessionStorage.setItem('profile', JSON.stringify(this.user));
          window.location.reload();
          this.isLoading = false;
          this.successAlert = true;
          this.allertMessage = response.detail;
        },
        (error: any) => {
          console.log(error);
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

  check(): void {
    this.isLoading = true;

    this.api.get('check-status/' + this.user.id).subscribe(
      (response: any) => {
        this.successAlert = true;
        this.allertMessage = response.detail;
        if (response.detail == 'Verified') {
          this.user['verification_status'] = 'VERIFIED';
          window.sessionStorage.setItem('profile', JSON.stringify(this.user));
          window.location.reload();
        }
      },
      (error: any) => {
        console.log(error);
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
  edit() {
    this.editing = true;
  }
  cancel() {
    this.editing = false;
  }
}
