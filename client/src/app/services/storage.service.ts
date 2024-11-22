import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie";
import { JwtHelperService } from "@auth0/angular-jwt";
import * as CryptoJS from "crypto-js";
import { environment } from "../../environments/environment.prod";
import { ParameterType } from "./enums/parameter-type";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  helper = new JwtHelperService();

  constructor(private cookieService: CookieService) {}

  setSessionStorage(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSessionStorage(key: string) {
    const storage = sessionStorage.getItem(key);
    if (storage?.startsWith("{") && storage?.endsWith("}")) {
      return JSON.parse(storage);
    } else {
      return storage;
    }
  }

  removeAllSessionStorage() {
    sessionStorage.clear();
  }

  removeSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  setLocalStorage(key: string, value: any) {
    if (typeof value === "object") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }

  getLocalStorage(key: string) {
    const storage = localStorage.getItem(key);
    if (storage?.startsWith("{") && storage?.endsWith("}")) {
      return JSON.parse(storage);
    } else {
      return storage;
    }
  }

  removeAllLocalStorage() {
    localStorage.clear();
  }

  removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  path?: string;
  domain?: string;
  expires?: string | Date;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
  storeUnencoded?: boolean;

  setToken(token: any) {
    this.cookieService.put("token", token, {
      expires: new Date(new Date().getTime() + 86400000),
      sameSite: "lax",
    });
  }

  getToken() {
    return this.cookieService.get("token");
  }

  deleteToken() {
    this.cookieService.remove("token");
  }

  setCookie(key: string, value: any) {
    this.cookieService.put(key, value, {
      expires: undefined,
      path: "/",
      sameSite: "lax",
    });
  }

  getCookie(key: string) {
    return this.cookieService.get(key);
  }

  removeCookie(key: string) {
    this.cookieService.remove(key);
  }

  setCookieObject(key: string, value: any) {
    this.cookieService.put(key, JSON.stringify(value), {
      expires: undefined,
      path: "/",
      sameSite: "lax",
    });
  }

  getCookieObject(key: string) {
    if (this.cookieService.get(key)) {
      return JSON.parse(this.cookieService.get(key));
    } else {
      return [];
    }
  }

  getDecodeToken() {
    if (this.getToken()) {
      return this.helper.decodeToken(this.getToken()).user;
    }
    return false;
  }

  getAdminIdSha1() {
    if (this.getToken()) {
      return this.helper.decodeToken(this.getToken()).user.admin_id;
    }
    return false;
  }

  encrypt(value: any) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(value),
      environment.ENCRIPTY_KEY
    ).toString();
  }

  decrypt(value: any) {
    return CryptoJS.AES.decrypt(value, environment.ENCRIPTY_KEY).toString(
      CryptoJS.enc.Utf8
    );
  }

  getSelectedLanguage(check?: boolean) {
    const config = this.getLocalStorage("config");
    if (config) {
      if (config.app.appLanguage === "rs" && check) {
        return "sr-Latn";
      }
      return config.app.appLanguage;
    }
    return "de";
  }

  getParametarsDateFromLocalStorageForApiRequest(params: any, body?: any) {
    if (!body) {
      body = {};
    }
    if (params.type === ParameterType.local_storage) {
      const storage = this.getLocalStorage(params.key);
      for (let i = 0; i < params.property.length; i++) {
        body[params.property[i]] = storage[params.property[i]];
      }
    }
    return body;
  }

  setFilterForGrid(key: string, value: string) {
    let gridConfig = this.getLocalStorage(key);
    if (gridConfig) {
      gridConfig["filter"] = value;
    } else {
      gridConfig = { filter: value };
    }
    this.setLocalStorage(key, gridConfig);
  }

  setDropdownFilterOptionForGrid(key: string, value: any) {
    let gridConfig = this.getLocalStorage(key);
    if (gridConfig) {
      gridConfig["filterOption"] = value;
    } else {
      gridConfig = { filterOption: value };
    }
    this.setLocalStorage(key, gridConfig);
  }

  setRegionFilterForGrid(key: string, value: any) {
    let gridConfig = this.getLocalStorage(key);
    if (gridConfig) {
      gridConfig["region"] = value;
    } else {
      gridConfig = { region: value };
    }
    this.setLocalStorage(key, gridConfig);
  }

  setFbzFilterForGrid(key: string, value: any) {
    let gridConfig = this.getLocalStorage(key);
    if (gridConfig) {
      gridConfig["fbz"] = value;
    } else {
      gridConfig = { fbz: value };
    }
    this.setLocalStorage(key, gridConfig);
  }

  setOffsetForGrid(key: string, value: string) {
    let gridConfig = this.getLocalStorage(key);
    if (gridConfig) {
      gridConfig["offset"] = value;
    } else {
      gridConfig = { offset: value };
    }
    this.setLocalStorage(key, gridConfig);
  }

  setTrainingValidForGrid(key: string, value: any) {
    let gridConfig = this.getLocalStorage(key);
    if (gridConfig) {
      gridConfig["training"] = value;
    } else {
      gridConfig = { training: value };
    }
    this.setLocalStorage(key, gridConfig);
  }

  setTrainingValidDateForGrid(key: string, value: any) {
    let gridConfig = this.getLocalStorage(key);
    if (gridConfig) {
      gridConfig["date"] = value;
    } else {
      gridConfig = { date: value };
    }
    this.setLocalStorage(key, gridConfig);
  }

  setValidCardForGrid(key: string, value: any) {
    let gridConfig = this.getLocalStorage(key);
    if (gridConfig) {
      gridConfig["validCard"] = value;
    } else {
      gridConfig = { validCard: value };
    }
    this.setLocalStorage(key, gridConfig);
  }
}
