import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ProtectedService } from '../../services/protected.service';

@Component({
  selector: 'app-adm-plt-rules',
  templateUrl: './adm-plt-rules.component.html',
  styleUrls: ['./adm-plt-rules.component.scss']
})
export class AdmPltRulesComponent implements OnInit {
  
  

  constructor(  
    private readonly auServ: AuthService,
    private readonly ps: ProtectedService ) { }

  ngOnInit(): void {
  }

}
