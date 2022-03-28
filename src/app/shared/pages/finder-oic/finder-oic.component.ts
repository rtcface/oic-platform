import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { FilterService } from 'primeng/api';

import { OicInterface } from 'src/app/oic/models/oic.interface';
import { GetOicService } from 'src/app/oic/services/get-oic.service';
import { OicInterfaceGql, OicEnte } from '../../../oic/models/oic.interface';
import { FormBuilder, FormGroup } from '@angular/forms';



@Component({
  selector: 'app-finder-oic',
  templateUrl: './finder-oic.component.html',
  styleUrls: ['./finder-oic.component.scss']
})
export class FinderOicComponent implements OnInit {

  finderForm: FormGroup = this.fb.group({
  "ente": ""});

  selectedOic?: OicInterface;
  filteredOic!: OicInterface[];
  oics?: OicInterfaceGql;


  @Output() onSelectedOicChange = new EventEmitter<OicInterface>();
  @Output() onEnter = new EventEmitter<OicEnte>();

  constructor( 
    private readonly filterService: FilterService,
    private readonly oic: GetOicService,
    private fb : FormBuilder,
    ) { }

  ngOnInit(): void {

    this.oic.getOicFromGraph("")
    .subscribe(
      {
        next: (data) => { 
          <OicInterfaceGql> data.data      
          this.oics = data.data!;
          //console.log("this.oics",this.oics);
          
          //console.log("a",a.items);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      }
    }); 
    


  }

 

  filterOic(event: any) {
    // in a real application, make a request to a 
    // remote url with the query and return filtered results,
    // for demo we filter at client side
    // console.log("event",event);
    let filtered: any[] = [];
    let query = event.query;   
    this.getDataEnte(query);
    // console.log("query",query);
    // console.log("this.oics ->>>>>>>>>>>>>>>desde el evento >>>",this.oics);
    // console.log("this.oics.length ->>>>>>>>>>>>>>>>>>>>>>> desde el evento",this.oics!.items.length);
    for (let i = 0; i < this.oics!.items.length; i++) {
      // console.log("desde el for",this.oics!.items.length);
      let oicItem = this.oics!.items[i];
      // console.log("oicItem",oicItem);
      // console.log("oicItem.nombre >> ates de if",oicItem.nombre_ente);
      // if (oicItem.nombre_ente.toLowerCase().indexOf(query.toLowerCase()) == 0) {
      //   console.log("oicItem.nombre >> desde el if",oicItem.nombre_ente);
        
      // }
      filtered.push(oicItem);
    }

    this.filteredOic = filtered;
    console.log("filteredOic",this.filteredOic);
  }

  getDataEnte(query:any){
    // console.log("query",query);
    this.oic.getOicFromGraph(query)
    .subscribe(
      {
        next: (data) => { 
          <OicInterfaceGql> data.data      
          this.oics = data.data!;
          //console.log("this.oics desde el evento",this.oics);
          
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('complete');
      }
    }); 
  }  

  finderEnte(){   
    //const { ente } = this.fiderForm.value;  
    this.onEnter.emit(this.finderForm.value);    
    console.log("Data emitida",this.finderForm.value);
    // clear the input
    this.finderForm.reset();
  }

  onSelectOic(oic: OicInterface) {
    this.selectedOic = oic;
    this.onSelectedOicChange.emit(oic);
    console.log("selectedOic",this.selectedOic);
    this.finderForm.reset();
  }


}
