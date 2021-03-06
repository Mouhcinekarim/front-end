import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, } from "@angular/common/http";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { LoginService } from "./login.service";
import { ConnexionResponse } from "../model/connexionResponse";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn:'root'
})

export class TokenIntercepter implements HttpInterceptor{
    isTokenRefreshing = false;
    refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(private loginService:LoginService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf('refresh') !== -1 || req.url.indexOf('login') !== -1) {
            return next.handle(req);
        }
       const jwtToken = this.loginService.getJwtToken();
       if (jwtToken) {
        return next.handle(this.addToken(req, jwtToken)).pipe(catchError(error => {
            if (error instanceof HttpErrorResponse
                && error.status === 403) {
                  // this.toaster.error('failed')
                  console.log('hii');
                return this.handleAuthErrors(req, next);
            } else {
              console.log('hii');
                return throwError(error);
            }
        }));
    }
    return next.handle(req);
    }

    private handleAuthErrors(req: HttpRequest<any>, next: HttpHandler)
        : Observable<HttpEvent<any>> {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.loginService.refrechToken().pipe(
                switchMap((refreshTokenResponse: ConnexionResponse) => {
                    this.isTokenRefreshing = false;
                    this.refreshTokenSubject
                        .next(refreshTokenResponse.authenticationToken);
                    return next.handle(this.addToken(req,
                        refreshTokenResponse.authenticationToken));
                })
            )
        } else {
            return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap((res) => {
                    return next.handle(this.addToken(req,
                        this.loginService.getJwtToken()))
                })
            );
        }
    }

    addToken(req: HttpRequest<any>, jwtToken: any) {
        return req.clone({
            headers: req.headers.set('Authorization',
                'Bearer ' + jwtToken)
        });
    }
}
