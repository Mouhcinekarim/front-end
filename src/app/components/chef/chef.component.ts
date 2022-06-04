import { Component, OnInit } from '@angular/core';
import { PFE } from 'src/app/model/PFE';
import { Group } from 'src/app/model/groupe';
import { PfeGroupProf } from 'src/app/model/PfeGroupProf';
import { ServicePfeService } from 'src/app/service/service-pfe.service';
import { LocalStorageService } from 'ngx-webstorage';
import {jsPDF } from 'jspdf';
import 'jspdf-autotable';
@Component({
  selector: 'app-chef',
  templateUrl: './chef.component.html',
  styleUrls: ['./chef.component.css']
})
export class ChefComponent implements OnInit {
  listprof:PFE[];
  listGroup:Group[];
  niveux:string;
  email_prof:string;
  Listmellane:PfeGroupProf[];
  head = [['Encadrant', 'Sujet PFE', 'Etudiants']]
  constructor(private fileService:ServicePfeService, private localStorage:LocalStorageService) { }

  ngOnInit(): void {
    this.email_prof=this.localStorage.retrieve('email');
    
  }

  cherche(){
    this.fileService.getProfTitre(this.email_prof,this.niveux).subscribe((profs)=>{
      this.listprof=profs;
      console.log( this.listprof)
    })
    this.fileService.getEtudiantGroup(this.email_prof,this.niveux).subscribe((groups)=>{
      this.listGroup=groups;
      console.log(this.listGroup)
    })
  }

  mellange(){
    this.fileService.mellangeGroupPfe(this.email_prof,this.niveux).subscribe((rsp)=>{
      console.log(rsp)
      this.Listmellane=rsp;
     this.createPdf(this.Listmellane)
    });
  }

  // Download list des group et prof
  createPdf(data:PfeGroupProf[]) {
   const rows=[];
   data.forEach(element => {
    // tslint:disable-next-line:max-line-length
    let etudinat:string=''
    element.etudiant.forEach((etd)=> etudinat+=`${etd.nom} ${edd.prenom}   `)
    const temp = [`${element.nom} ${element.prenom}
    ${element.email}`, element.titre,etudinat];
    rows.push(temp);
  
  });
    var doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`List de PFE de : ${this.niveux}`, 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);


    (doc as any).autoTable({
      head: this.head,
      body: rows,
      theme: 'plain',
      didDrawCell: data => {
        console.log(data.column.index)
      }
    })

    // below line for Open PDF document in new tab
    doc.output(`PFEs ${this.niveux}`)

    // below line for Download PDF document  
    doc.save(`PFEs ${this.niveux}`);
  }

}


