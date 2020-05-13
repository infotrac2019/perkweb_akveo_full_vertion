import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, retry, tap, finalize } from "rxjs/operators";
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
  NbToastrConfig,
} from "@nebular/theme";
import { ResponseDto } from "../model/response-dto";

@Injectable({
  providedIn: "root",
})
export class HttpRequestService {
  constructor(
    private http: HttpClient,
    private toastrService: NbToastrService
  ) {}

  private toggleLoader(showLoader) {
    if (showLoader) {
      this.showLoader();
    } else {
      this.hideLoader();
    }
  }

  public async getDataSync(url, showLoader = false): Promise<any> {
    this.showLoader();
    const data = await this.http.get(url).toPromise();
    this.hideLoader();
    return data;
  }

  public getData(url, showResponse, showLoader = false): Observable<any> {
    this.toggleLoader(showLoader);
    return this.http.get(url).pipe(
      tap((response) => this.responseReceived(response, showResponse)),
      catchError((err) => this.errorHandler(err))
    );
  }

  errorHandler(error: HttpErrorResponse) {
    const errorMessage = error.message ? error.message : error.error.message;
    this.showToast("danger", "Error", errorMessage);
    return throwError(error);
  }

  public postData(
    url: string,
    data: any,
    showResponse,
    showLoader = false
  ): Observable<any> {
    this.toggleLoader(showLoader);
    return this.http.post(url, data).pipe(
      tap((response) => this.responseReceived(response, showResponse)),
      catchError((err) => this.errorHandler(err)),
      finalize(() => this.hideLoader())
    );
  }

  public putData(
    url: string,
    data: any,
    showResponse,
    showLoader = false
  ): Observable<any> {
    this.toggleLoader(showLoader);
    return this.http.put(url, data).pipe(
      tap((response) => this.responseReceived(response, showResponse)),
      catchError((err) => this.errorHandler(err)),
      finalize(() => this.hideLoader())
    );
  }

  public deleteData(
    url: string,
    id: string,
    showResponse,
    showLoader = false
  ): Observable<any> {
    return this.http.delete(url + id).pipe(
      tap((response) => this.responseReceived(response, showResponse)),
      catchError((err) => this.errorHandler(err)),
      finalize(() => this.hideLoader())
    );
  }

  private showLoader(): void {
    // this.loaderService.show();
  }
  private hideLoader(): void {
    //this.loaderService.hide();
  }

  private responseReceived(response: any, showResponse: boolean) {
    if (showResponse) {
      if (response.status === "Success") {
        this.showToast("success", response.status, response.message);
      }
    }
    if (response.status === "Error") {
      this.showToast("danger", response.status, response.message);
    } else if (response.status === "Info") {
      this.showToast("info", response.status, response.message);
    } else if (response.status === "Warning") {
      this.showToast("warning", response.status, response.message);
    }
    this.hideLoader();
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 0,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: true,
    };
    const titleContent = title ? `${title}` : "";

    this.toastrService.show(body, `${titleContent}`, config);
  }
}
