import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginValue?:string;
  userValue?:string;
  constructor( private router:Router,
    private authService:AuthService
    ) { }

  ngOnInit(): void {
  }

  login(){
    console.log(this.loginValue);
    console.log(this.userValue);
    this.authService.login(this.loginValue,this.userValue).subscribe(
      (data)=>{
        console.log(data);
        //this.router.navigate(['/']);
      }
    );
    //this.router.navigate(['./home']);
  }


}
