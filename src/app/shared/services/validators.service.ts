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

  public phonePattern = /^\+?3?8?(0\d{9})$/;

  public namePatternEng = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;

  public nameLastNamePattern : string = '^[a-zA-Zа-яА-ЯёЁ\s]+$';

  constructor() { }

  public validateEmail(email: string) : boolean {
    return this.emailPattern.test(email);
  }

  public validatePassword(password: string) : boolean {
    return this.passwordPattern.test(password);
  }

  public validatePhone(phone: string) : boolean {
    return this.phonePattern.test(phone);
  }

  public validateName(name: string) : boolean {
    return this.namePatternEng.test(name);
  }

  public validateNameLastName(name: string) : boolean {

    let pattern = new RegExp(this.nameLastNamePattern);
    return pattern.test(name);
  }

  


}
