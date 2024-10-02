import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";
import { ParameterType } from "./enums/parameter-type";
import { UserTypes } from "app/components/dashboard/enums/user-types";

@Injectable({
  providedIn: "root",
})
export class HelpService {
  constructor(private _storageService: StorageService) {}

  postRequestDataParameters(body: any, data: any, parameters: string[]) {
    for (let i = 0; i < parameters.length; i++) {
      body[parameters[i]] = data[parameters[i]];
    }
    return body;
  }

  getRequestDataParameters(
    data: any,
    parameters: string[],
    parameterType?: ParameterType
  ) {
    let value = "";
    if (parameters) {
      if (!parameterType || parameterType === ParameterType.params) {
        for (let i = 0; i < parameters.length; i++) {
          value += data[parameters[i]] + "/";
        }
      } else {
        value = "?";
        for (let i = 0; i < parameters.length; i++) {
          value += parameters[i] + "=" + data[parameters[i]];

          if (i + 1 < parameters.length) {
            value += "&";
          }
        }
      }
    }
    return value;
  }

  setSessionStorage(key: string, value: any) {
    sessionStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
  }

  getSessionStorage(key: string) {
    if (sessionStorage.getItem(key) != null) {
      return sessionStorage.getItem(key);
    } else {
      return null as any;
    }
  }

  removeSessionStorage(key: string) {
    sessionStorage.removeItem(key);
  }

  removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  getCurrentDatetime() {
    const date = new Date();
    return `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}. ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  setLanguage(value: any) {
    localStorage.setItem(
      "language",
      typeof value === "string" ? value : JSON.stringify(value)
    );
  }

  getLanguage() {
    if (localStorage.getItem("language")) {
      return JSON.parse(localStorage.getItem("language") ?? "{}");
    } else {
      return null;
    }
  }

  copyObject(value: any) {
    return JSON.parse(JSON.stringify(value));
  }

  setLocalStorage(key: string, value: any) {
    localStorage.setItem(
      key,
      typeof value === "string" ? value : JSON.stringify(value)
    );
  }

  converToMiliseconds(hour: number, minutes?: number, seconds?: number) {
    return (
      hour * 3600 * 1000 +
      (minutes ? minutes : 0) * 60 * 1000 +
      (seconds ? seconds : 0) * 1000
    );
  }

  converToMinutes(hour: number, minutes?: number, seconds?: number) {
    return hour * 60 + (minutes ? minutes : 0) + (seconds ? seconds / 60 : 0);
  }

  convertStringToJson(value: string) {
    return JSON.parse(value);
  }

  getTypeOfName(type: any) {
    for (var item in UserTypes) {
      if (Number(item) === type) {
        return UserTypes[item];
      }
    }
    return UserTypes[UserTypes.admin];
  }

  checkRights(rights: any) {
    const type = this.getTypeOfName(this._storageService.getDecodeToken().type);
    if (rights) {
      for (let i = 0; i < rights.length; i++) {
        if (rights[i] === type) {
          return true;
        }
      }
      return false;
    } else return true;
  }

  checkUndefinedProperty(property) {
    for (let [key, value] of Object.entries(property)) {
      if (value != undefined) {
        return true;
      }
    }
    return false;
  }

  checkIsMobileDevices() {
    const userAgent = navigator.userAgent;
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        userAgent
      ) ||
      window.innerWidth < 993
    ) {
      return true;
    } else {
      return false;
    }
  }

  replaceText(text: string, replaceValue: string, newValue: any) {
    return text.replace(replaceValue, newValue);
  }

  addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }

  addMonthsToCurrentDate(currentDate: any, months: number) {
    if (currentDate) {
      return new Date(
        new Date(currentDate).setMonth(
          new Date(currentDate).getMonth() + months
        )
      );
    } else {
      return new Date(new Date().setMonth(new Date().getMonth() + months));
    }
  }

  calculateDiffInDays(date) {
    let currentDate = new Date();
    date = new Date(date);

    if (date < currentDate) {
      return 0;
    } else {
      return Math.floor(
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
          Date.UTC(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          )) /
          (1000 * 60 * 60 * 24)
      );
    }
  }

  daysInYear(year) {
    return (year % 4 === 0 && year % 100 > 0) || year % 400 == 0 ? 366 : 365;
  }

  daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  calculatePercentage(current, full) {
    return (current / full) * 100;
  }

  copyToClipboard(value) {
    navigator.clipboard.writeText(value);
  }

  isObjectEmpty(value) {
    return Object.keys(value).length ? true : false;
  }
}
