import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PFEinfo } from 'src/app/model/PFEinfo';
import { ServicePfeService } from 'src/app/service/service-pfe.service';

@Component({
  selector: 'app-mes-sujets',
  templateUrl: './mes-sujets.component.html',
  styleUrls: ['./mes-sujets.component.css']
})
export class MesSujetsComponent implements OnInit {

  pfeValidation = new FormGroup({
    //   * validations ancien et nouveau pfe
    titre : new FormControl('',
                            [
                                Validators.required,
                                Validators.minLength(5),
                                Validators.pattern('[a-zA-Z]*')
                            ]),
    description : new FormControl('',
                                    [
                                        Validators.required,
                                        Validators.minLength(20),
                                        Validators.pattern('[a-zA-Z0-9 ]*')
                                    ]),
    anne : new FormControl('',
                                    [
                                        Validators.required,
                                        Validators.minLength(4),
                                        Validators.maxLength(4),
                                        Validators.min(2010),
                                        Validators.max(2022),
                                        Validators.pattern('[0-9]*')
                                    ]),
    //   * validations ancien pfe
    pageGard : new FormControl('',
                                    [
                                        Validators.required
                                    ]),
    rapport : new FormControl('',
                                [
                                    Validators.required,
                                    Validators.pattern('[.pdf]$')
                                ]),
      niveux : new FormControl('',
                                [
                                    Validators.required,
                                    Validators.minLength(5),
                                    Validators.pattern('[a-zA-Z]*')
                                ])

    });

// getters
get titre(){
    return this.pfeValidation.get('titre');
}
get niveux(){
  return this.pfeValidation.get('niveux');
}
get description(){
    return this.pfeValidation.get('description');
}
get anne(){
    return this.pfeValidation.get('anne');
}
// todo : page garde et rapport
get pageGard(){
    return
}
// * chat validation
// todo : message(description) et fichier validation

// ********************************************************** //
currentTime = new Date()
closeResult :string;
pfe:PFEinfo;

constructor(private fileService:ServicePfeService) { }

ngOnInit(): void {
  this.pfe=new  PFEinfo();
  this.pfe.idprof='hichame@gmail.com';
  this.pfe.stage=false;

}

chargerapport(event:any){
  this.blobToBase64( event.target.files[0]).then(res=>{
   this.pfe.rapport1=(res as string);
   this.pfe.conferm=true
 })

}

chargephoto(event:any){

  this.blobToBase64( event.target.files[0]).then(res=>{
    this.pfe.photo1=(res as string);
    this.pfe
  })

 
}



Upload(){
  this.pfe.titre=this.titre.value;
  this.pfe.niveau=this.niveux.value
  this.pfe.description=this.description.value
  this.pfe.anne=this.anne.value
  console.log(this.pfe)
  var formdata = new FormData();
 
//  JSON.stringify(this.pfe)
 
  
  
  console.log(JSON.stringify(this.pfe))
  this.pfe.anne=this.currentTime.getFullYear();
  this.fileService.upload(JSON.stringify(this.pfe)).subscribe(
    resp => {
      console.log(resp.status)
      if(resp.status === 200) { this.pfe=new PFEinfo();
                                this.pfe.idprof='hichame@gmail.com'

      }
      else console.log("no 200")
    
    }
    
  )
}

// ----------------------------Concerne modal 



// ---------------------convert blob to base64
 blobToBase64  = blob => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise<string|ArrayBuffer>(resolve => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
}