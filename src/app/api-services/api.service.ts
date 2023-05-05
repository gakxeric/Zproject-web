import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  BASE_URL = 'http://localhost:8000/';

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public error: BehaviorSubject<string> = new BehaviorSubject<string>('');

  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  fHeaders = {
    headers: new HttpHeaders({}),
  };

  constructor(private http: HttpClient) {
    const profile = JSON.parse(
      window.sessionStorage.getItem('profile') as string
    );

    if (profile) {
      this.headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Token ${profile.token}`,
        }),
      };

      this.fHeaders = {
        headers: new HttpHeaders({
          Authorization: `Token ${profile.token}`,
        }),
      };
    }
  }

  reInit() {
    const profile = JSON.parse(
      window.sessionStorage.getItem('profile') as string
    );

    if (profile) {
      this.headers = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Token ${profile.token}`,
        }),
      };

      this.fHeaders = {
        headers: new HttpHeaders({
          Authorization: `Token ${profile.token}`,
        }),
      };
    }
  }


  refreshHeaders(token: string) {
    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Token ${token}`,
      }),
    };
  }
  refreshfHeaders(token: string) {
    this.fHeaders = {
      headers: new HttpHeaders({
        Authorization: `Token ${token}`,
      }),
    };
  }

  setLoadingStatus(status: boolean) {
    this.isLoading.next(status);
  }
  get(path: string) {
    const url = `${this.BASE_URL}${path}`;
    return this.http.get(url, this.headers);
  }

  post(path: string, data: any) {
    const url = `${this.BASE_URL}${path}`;
    return this.http.post(url, data, this.headers);
  }

  patch(path: string, data: any) {
    const url = `${this.BASE_URL}${path}`;
    return this.http.patch(url, data, this.headers);
  }

  postFormData(path: string, data: any) {
    const url = `${this.BASE_URL}${path}`;
    return this.http.post(url, data, this.fHeaders);
  }

  patchFormData(path: string, data: any) {
    const url = `${this.BASE_URL}${path}`;
    return this.http.patch(url, data, this.fHeaders);
  }

  delete(path: string) {
    const url = `${this.BASE_URL}${path}`;
    return this.http.delete(url, this.headers);
  }
}
