import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  public configValue = new Subject<any>();
  public refreshAfterRemoveFile = new Subject<any>();

  constructor() {}

  sendConfigValueEmit(value: any) {
    this.configValue.next(value);
  }

  getConfigValueEmit(): Observable<any> {
    return this.configValue.asObservable();
  }

  sendRefreshGrid(value?: any) {
    this.refreshAfterRemoveFile.next(value);
  }

  getRefreshGrid(): Observable<any> {
    return this.refreshAfterRemoveFile.asObservable();
  }
}
