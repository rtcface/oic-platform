import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  //
  // ─── VALIDATE EMAIL ────────────────────────────────────────────────────────────────
  // 
  public emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 
  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  public phonePattern = "^((\\+91-?)|0)?[0-9]{10}$";

  public namePatternEng = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;

  public nameLastNamePattern : string = '^[a-zA-Zа-яА-ЯёЁ\s]+$';

  public nameAndLastNamePattern : string  = '([a-zA-Z]+) ([a-zA-Z]+)';

  public urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  constructor() { }

  public validateEmail(email: string) : boolean {
    return this.emailPattern.test(email);
  }

  public validatePassword(password: string) : boolean {
    return this.passwordPattern.test(password);
  }
  
  public validateName(name: string) : boolean {
    return this.namePatternEng.test(name);
  }

  public validateNameLastName(name: string) : boolean {

    let pattern = new RegExp(this.nameLastNamePattern);
    return pattern.test(name);
  }

 
  


}
