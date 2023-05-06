import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/api-services/api.service';

@Component({
  selector: 'app-lin-auth',
  templateUrl: './lin-auth.component.html',
  styleUrls: ['./lin-auth.component.scss'],
})
export class LinAuthComponent implements OnInit {
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      const loginId = params['login_id'];

      if (loginId) {
        this.login(loginId);
      }
    });
  }

  login(loginId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.api.get(`auth/login-with-magic-link?login_id=${loginId}`).subscribe(
      (response: any) => {
        this.isLoading = false;
        this.errorMessage = null;
        window.sessionStorage.setItem('profile', JSON.stringify(response));
        this.router.navigate(['/dashboard/prrofile']);
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;

        try {
          this.errorMessage = error.error.detail;
        } catch (err) {
          this.errorMessage = 'Network error';
        }
      }
    );
  }
}
