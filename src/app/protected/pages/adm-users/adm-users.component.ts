import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adm-users',
  templateUrl: './adm-users.component.html',
  styleUrls: ['./adm-users.component.scss']
})
export class AdmUsersComponent implements OnInit {
  
  constructor(
  
    ) { }
  

  ngOnInit(): void {
    
   
  }
    display: boolean = false;

    showDialog() {
        this.display = true;
        // console.log(this.display);
    }

    onNodeSelect(event:any) {
      this.display = true;
  }

}
