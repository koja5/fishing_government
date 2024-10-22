import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HelpService } from "./help.service";
import { StorageService } from "./storage.service";
import { ParameterType } from "./enums/parameter-type";
import { Request } from "app/components/dashboard/@core/dynamic-component/dynamic-forms/models/complex-properties/request";

@Injectable({
  providedIn: "root",
})
export class CallApiService {
  private headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private helpService: HelpService,
    private _storageService: StorageService
  ) {
    this.headers = new HttpHeaders();
  }

  callApi(data: any, router?: any) {
    if (data && data.request) {
    }
    if (data && data.request && data.request.type === "POST") {
      if (data.request.url) {
        data.body = this.helpService.postRequestDataParameters(
          data.body,
          router.snapshot.params,
          data.request.url
        );
      }
      return this.callPostMethod(
        data.request.api,
        data.body ? data.body : router.body
      );
    } else {
      if (data && data.request.url) {
        const dataValue = this.helpService.getRequestDataParameters(
          router.snapshot.params,
          data.request.url
        );
        return this.callGetMethod(data.request.api, dataValue);
      } else if (data.request.parametarsDate) {
        if (data.request.parametarsDate[0].type === "localStorage") {
          const dataValue = this.helpService.getRequestDataParameters(
            this._storageService.getLocalStorage(
              data.request.parametarsDate[0].key
            ),
            data.request.parametarsDate[0].property,
            data.request.parameterType
          );
          return this.callGetMethod(data.request.api, dataValue);
        }
      } else {
        let dataValue = "";
        if (router && router.snapshot && data && data.request) {
          dataValue = this.helpService.getRequestDataParameters(
            router.snapshot.params,
            data.request.parameters
          );
          return this.callGetMethod(data.request.api, dataValue);
        } else if (data && data.request) {
          return this.callGetMethod(data.request.api, dataValue);
        } else {
          return this.callGetMethod(router.api, dataValue);
        }
      }
    }
  }

  callServerMethod(request: any, data: any, router?: any) {
    if (request.url) {
      data = this.helpService.postRequestDataParameters(
        data,
        router.snapshot.params,
        request.url
      );
    }
    if (request.type === "POST") {
      return this.callPostMethod(request.api, data);
    } else {
      return this.callGetMethod(request.api, data);
    }
  }

  callPostMethod(api: string, data?: any) {
    return this.http.post(api, data, { headers: this.headers });
  }

  callGetMethod(api: string, data?: any) {
    if (data === undefined) {
      data = "";
    }
    const url = api.endsWith("/") ? api + data : data ? api + "/" + data : api;
    return this.http.get(url, { headers: this.headers });
  }

  getDocument(body: any) {
    return this.http.post("/api/upload/getDocument", body, {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json"),
    });
  }

  packParametarPost(data: any, fields: any) {
    let model = {};
    if (fields) {
      for (let i = 0; i < fields.length; i++) {
        model[fields[i].name] = data[fields[i].path];
      }
      return model;
    } else {
      return {};
    }
  }

  packParametarGet(data: any, fields: any) {
    let model = [];
    if (fields) {
      for (let i = 0; i < fields.length; i++) {
        model.push(data[fields[i]]);
      }
    }

    return model.toString();
  }

  buildParameterDate(request: Request, data?: any) {
    let body = {};
    if (request.fields) {
      if (request.type === "POST") {
        body = this.packParametarPost(data, request.fields);
      } else {
        body = this.packParametarGet(data, request.fields);
      }
    }
    if (request.parametarsDate) {
      for (let i = 0; i < request.parametarsDate.length; i++) {
        if (request.parametarsDate[i].type === ParameterType.local_storage) {
          body =
            this._storageService.getParametarsDateFromLocalStorageForApiRequest(
              request.parametarsDate[i],
              body
            );
        }
      }
    }
    return body;
  }
}
