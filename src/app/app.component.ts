import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  mockObj = {
    title: "Car Manuf Facility",
    description: 'Dependable Comissioning, Inc',
    entities: [
              {
                id: "10",
                nome: " Project Overview",
                nItems: "1",
                icon: "home-sharp",
                description: "Home"
              },
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

  constructor(
    private router: Router,
  ) {}

  public pageName: string = "Project Overview";
  public pageId: string = "";
  public routePageId: string = "";
  public optionIsSelected: boolean = false;
  public sideMenuIsFolded: boolean = false;

  public setPageValuestoDefault(){
    this.pageId = '';
    this.pageName = 'Project Overview';
    this.router.navigate(['/home']);
  }

   /**
   * Checks whether the object's id value is even or odd. If it's even, 'true'
   * is returned and the page's background turns grey. Otherwise,
   * false is returned and the background turns white.
   * @param number 
   * @returns boolean
   */
   checkOddEven(number: string) : boolean {
    var num = parseInt(number);

    if (num % 2 === 0) {
      return true;
    }else{
      return false;
    }
  }

  /**
   * 
   * @param id 
   * @param nome 
   * @param icon 
   * @param entityDescription 
   */
  goToPage(id: any, nome: any, icon: any, entityDescription: any) {

    if(id === "10") {
      this.router.navigate(['/home']);
      this.pageName = nome;
      this.pageId = id;
    }
    else {
      this.router.navigate(['/list', id, nome, icon, entityDescription]);
      this.pageName = nome;
      this.pageId = id;     
    }
  }

  /**
   * Checks whether the option on the side menu is selected or not. In the first case,
   * when the side menu is unfolded, the selected option's icon and text will turn
   * from navy blue to green, while the background will keep its white color. In the 
   * other hand, when the side menu is folded, the selected option's icon and text will
   * turn from navy blue to white, while the background will change from white to green.
   * @param key 
   * @returns boolean
   */
  ionMenuOptionIsSelected(key: string): boolean {
    if(key === this.pageId){
      return true;
    }
    else{
      return false;
    }
  }

  /**
   * Changes the value of this.sideMenuIsFolded from "true" to "false", 
   * and vice-versa, so it folds or unfolds the side menu.
   */
  foldSideMenu() {
    this.sideMenuIsFolded = !this.sideMenuIsFolded;
  }

  /**
   * Checks if the side menu is folded or not.
   * @returns boolean
   */
  checkIfSideMenuIsFolded() : boolean {
    if(this.sideMenuIsFolded == true) {
      return true;
    }
    else{
      return false;
    }
  }

  /**
   * If pageId value is not '10', then the "close" button on ion-toolbar must be
   * rendered. Otherwise, if the pageId value is '10', the "close" button on
   * ion-toolbar must not be rendered. That's because the page of id = '10' is
   * the Project Overview page, which shall not have a "close" button.
   * @returns boolean
   */
  pageIdIsNotTen() : boolean {
    if(this.pageId !== '10') {
      return true;
    }
    else{
      return false;
    }
  }
}
