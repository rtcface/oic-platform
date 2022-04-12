import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ChildChild, filterWpd, root, RootChild, tree } from 'src/app/oic/models/tree.interface';
import { GetOicService } from 'src/app/oic/services/get-oic.service';
import { planWork, planWorkDataAdd, deletePlanWork } from '../../models/plan-work.interface';
import { ProtectedService } from '../../services/protected.service';

@Component({
  selector: 'app-adm-workplan',
  templateUrl: './adm-workplan.component.html',
  styleUrls: ['./adm-workplan.component.scss'],
  providers: [MessageService, ConfirmationService]

})
export class AdmWorkplanComponent implements OnInit {

  id_ente:string = this.auth.idEnteAuth;
  files: TreeNode[] = [];
  nodes: any[]=[];
  selectedNode: any[] = [];
  display: boolean = false;
  displayForm: boolean = false;
  id_Anio: string='';

  update_wpd: planWork = {} as planWork;

  saveForm = this.fb.group({
    id: [''],
    label: ['',[Validators.required]],
    data: ['',[Validators.required]],
    url: ['',[Validators.required]],
  });

  updateForm = this.fb.group({
    id: [''],
    label: ['',[Validators.required]],
    data: ['',[Validators.required]],
    url: ['',[Validators.required]],
  });

  get displayDialog() {
    return this.display;
  }


  constructor(
    private readonly oic: GetOicService,
    private readonly ms: MessageService,
    private readonly auth: AuthService,
    private readonly fb : FormBuilder,
    private readonly pt: ProtectedService,  
    private readonly cs: ConfirmationService

  ) { }
  

  ngOnInit(): void {   
    this.loadWorkPlan();
  }

  filterTree(event: any) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    let query = event.query;
    for (let i = 0; i < this.files!.length; i++) {
      let fileItem = this.files![i];
      if (fileItem.label!.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(fileItem);
      }
    }

    this.files = filtered;
  }

  nodeSelect(event: any) {
    // console.log(event);  

    if(event.node.id && event.node.isChild){
      this.display = true;
      this.loadFormUpdate(event.node);
    }else{
      this.display = false;
    }    
  }

  nodeSelectSave(event: any) {
    if(event.node.isRoot)
    {
      this.id_Anio = event.node.id;
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>", event.node);     
      this.displayForm = true;
    }
    else{
      this.displayForm = false;
    }
  }

  loadFormUpdate(data:any){
    this.update_wpd.id = data.id;
    this.update_wpd.label = data.label;
    this.update_wpd.data = data.data;
    this.update_wpd.url = data.url;
  }

  redirect(url: string) {
    window.open(url, '_blank');
  }

  loadWorkPlan() {
    const fiter: filterWpd = {
      ente: {
        ente_publico: this.id_ente
      }
    }
    this.loadWpd(fiter);

  }

  loadWpd(filter: filterWpd) {

    this.oic.getWorkPlanFromGraph(filter)
      .subscribe({
        next: (result) => {
          const res: any = result.data!;
           console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> a", res.data);
          if (res.data.label !== null) {
          <tree[]> [res!.data!];
          //map to TreeNode
          this.files =[ res!.data].map(
            (item: root) => {
              return {
                label: item.label,
                data: item.data,
                children: item.children!.map(
                  (child: RootChild) => {
                    return {
                      id: child.id,
                      isRoot: true,
                      label: child.label,
                      data: child.data,
                      children: child.children!.map(
                        (childChild: ChildChild) => {
                          return{
                            isChild: true,
                            id:  childChild.id,
                            label: childChild.label,
                            data: childChild.data,
                            icon: childChild.icon,
                            url: childChild.url
                          }                        
                    })
                  }
                }
                )
              }
                
            });
          }
          else {
            this.showError();
            this.files = [];
          }
            
         
        },
        error: (error) => {
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta", error);
        }

      });
      
        
       
      
    


  }


  showError() {
    this.ms.add({ severity: 'info', summary: 'Información', detail: 'No hay datos del ente solicitado...' });   //<-- Mensaje de error
  }

  
  validateField(field: string) {
    return this.saveForm.get(field)?.invalid && this.saveForm.get(field)?.touched;
  }

  validateFieldUpdate(field: string) {
    return this.updateForm.get(field)?.invalid && this.updateForm.get(field)?.touched;
  }


  getErrorMessage(field: string) {
    const message:string = "Debe ingresar un valor válido";
   
    return this.saveForm.get(field)?.hasError('required') ? message :
    this.saveForm.get(field)?.hasError('minlength') ? 'minimo 3 caracteres' :
    '';    
  }

  getErrorMessageUpdate(field: string) {
    const message:string = "Debe ingresar un valor válido";
   
    return this.updateForm.get(field)?.hasError('required') ? message :
    this.updateForm.get(field)?.hasError('minlength') ? 'minimo 3 caracteres' :
    '';    
  }

  saveFile() {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>", this.saveForm.value);
    if(this.saveForm.invalid){      
      this.saveForm.markAllAsTouched();
    }else{
     const plan:planWorkDataAdd = {
        IdParent: this.id_Anio,
        label: this.saveForm.value.label,
        data: this.saveForm.value.data,
        url: this.saveForm.value.url,
    }

    this.pt.savePlwd(plan).subscribe({
      next: (result) => {
        const res: any = result.data!;
        this.loadWorkPlan();
        this.display = false;
        this.saveForm.reset();
        this.ms.add({ severity: 'success', summary: 'Información', detail: 'Se ha guardado el plan de trabajo...' });   //<-- Mensaje de error
        
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> a", res);
      },
      error: (error) => {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta", error);
      },
      complete: () => {
      
      }
    });
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>", plan);
  }
}

updateFile(){
  // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>", this.update_wpd.id);
  if(this.updateForm.invalid){
    this.updateForm.markAllAsTouched();
  }
  else{
    const plan:planWork = {
      id: this.update_wpd.id,
      label: this.updateForm.value.label,
      data: this.updateForm.value.data,
      url: this.updateForm.value.url,
  }

  this.pt.updatePlwd(plan).subscribe({
    next: (result) => {
      const res: any = result.data!;
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> a", res);
    },
    error: (error) => {
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta", error);
    },
    complete: () => {
      this.loadWorkPlan();
      this.display = false;
      this.updateForm.reset();
      this.ms.add({ severity: 'success', summary: 'Información', detail: 'Se ha actualizado el plan de trabajo...' });   //<-- Mensaje de error
      this.ngOnInit();

      //this.reloadCurrentPage();
    }
  });
  // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>", plan);
}
}


  deletePlanWork(pw: deletePlanWork){

    this.pt.deletePlwd(pw).subscribe({
      next: (result) => {
        const res: any = result.data!;
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> a", res);
      },
      error: (error) => {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta", error);
      },
      complete: () => {
        this.loadWorkPlan();
        this.display = false;
        this.saveForm.reset();
        this.ms.add({ severity: 'success', summary: 'Información', detail: 'Se ha eliminado el plan de trabajo...' });   //<-- Mensaje de error
        this.ngOnInit();

       // this.reloadCurrentPage();

      }
    });

  }


  updatePlanWork(pw: planWork){
    this.pt.updatePlwd(pw).subscribe({
      next: (result) => {
        const res: any = result.data!;
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>> a", res);
      },
      error: (error) => {
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>Error en la consulta", error);
      },
      complete: () => {
        this.loadWorkPlan();
        this.display = false;
        this.saveForm.reset();
        this.ms.add({ severity: 'success', summary: 'Información', detail: 'Se ha actualizado el plan de trabajo...' });   //<-- Mensaje de error
        this.ngOnInit();
      }
    });
  }

  confirm(event: Event) {
    this.cs.confirm({
        target: event.target!,
        message: `Esta seguro de eliminar el archivo ${this.update_wpd.label} ?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {          
          const pwDel:deletePlanWork={
            id: this.update_wpd.id
          };
          this.deletePlanWork(pwDel);
        },
        reject: () => {
          this.noDelete();          
        }
    });
}

noDelete() {
  this.ms.add({ severity: 'error', summary: 'Cancelo', detail: `Sera en otra ocasión ${this.update_wpd.label}...`});   //<-- Mensaje de error
}

// reloadCurrentPage() {
//   window.location.reload();
//  }

}
