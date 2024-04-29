import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  mockObj = {
    title: "Car Manuf Facility",
    description: 'Dependable Comissioning, Inc',
    entities: [
              {
                id: "0",
                nome: "Tasks", 
                nItems: "64",
                icon: "pencil",
                descriptionText: "Tasks consists in (...)",
              },
              {
                id: "1",
                nome: "Site Activies",
                nItems: "24",
                icon: "construct",
                descriptionText: "Site Activities consists in (...)",
              },
              {
                id: "2",
                nome: "Checklist",
                nItems: "1366",
                icon: "checkbox-sharp",
                descriptionText: "Checklist consists in (...)",
                 
              },
              {
                id: "3",
                nome: "Equipament",
                nItems: "402",
                icon: "settings-sharp",
                descriptionText: "Equipament consists in (...)",
              },
              {
                id: "4",
                nome: "Documents",
                nItems: "44",
                icon: "document-sharp",
                descriptionText: "Documents consists in (...)",
              },
              {
                id: "5",
                nome: "Issues",
                nItems: "201",
                icon: "warning-sharp",
                descriptionText: "Issues consists in (...)",
              },
              {
                id: "6",
                nome: "Observations",
                nItems: "201",
                icon: "eye-sharp",
                descriptionText: "Observations consists in (...)",
              },
              {
                id: "7",
                nome: "Functional Tests",
                nItems: "282",
                icon: 'clipboard',
                descriptionText: "Functional Tests consists in (...)",
              },
              {
                id: "8",
                nome: "Systems",
                nItems: "24",
                icon: "cog",
                descriptionText: "Systems consists in (...)",          
              },
              {
                id: "9",
                nome: "Participants",
                nItems: "24",
                icon: "people-sharp",
                descriptionText: "Participants consists in (...)",
              }],
              
  }

  fabButtonLabelObj = [
    {
      id: 0,
      fabButton: 'stats',
      label: ''
    },
    {
      id: 1,
      fabButton: 'stats',
      label: ''
    },
    {
      id: 2,
      fabButton: 'stats',
      label: ''
    },
    {
      id: 3,
      fabButton: 'stats',
      label: ''
    },
    {
      id: 4,
      fabButton: 'stats',
      label: ''
    },
    {
      id: 5,
      fabButton: 'stats',
      label: ''
    }
  ]

  mockObjEntitiesFiltered : any[] = [...this.mockObj.entities];
  
  constructor(
              private router: Router,
              public appComponent: AppComponent
            ) {}

  goToPage(id: string, nome: string, icon: string, entityDescription: string) {
    this.router.navigate(['/list', id, nome, icon, entityDescription]);
    this.appComponent.pageName = nome;
    this.appComponent.pageId = id;
  }

  handleInput(event: any) {

    const query = event.target.value.toLowerCase();

    if(!query || query.length < 3) {
      this.mockObjEntitiesFiltered = [...this.mockObj.entities];
    }
    else {
      // this.mockObjEntitiesFiltered = this.mockObj.entities.filter((entity) => {
      //   return (entity.nome.toLowerCase().includes(query))
      // })

      this.mockObjEntitiesFiltered = this.mockObj.entities.filter((entity) => {
        return (entity.nome.toLowerCase().includes(query))
      })
    }
  }
  
}
