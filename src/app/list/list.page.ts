import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { InputListComponent } from './input-list/input-list.component';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { AbstractControl, ValidationErrors, FormGroup, Validators, FormControl, FormArray, FormBuilder} from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PhotoService } from '../services/photo.service';
import { Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})

export class ListPage implements OnInit {

  sourceFileName = Date.now() + 'jpeg';
  
  imagePath: string | undefined;
  storedPhoto: string = "";

  listPageGroup: any;
  registrationForm: any;
  selectedValue: number = 0;

  id: string = "";
  nome: string = "";
  icon: string = "";
  descriptionText: string = "";
  inputContent: string = "";
  form: string = "";
  toolName: string = "";
  retrievedFromLS: string = "";
  alert: string = "";

  // name = new FormControl("Bob")
  
  public isVisible: boolean = false;
  public isChecked: boolean = false;
  public disabled: boolean = false;
  public isModalOpen: boolean = false;
  public isSubmitted: boolean = false;
  public isGaleryOpen: boolean = false;
  public loadSourceFolder: boolean = false;
  public loadDestFolder: boolean = false;

  loremIpsum: string = "lorem ipsum dolor sit amet consectetur adipisicing elit.\
                        Magni illum quidem recusandae ducimus quos reprehenderit.\
                        Veniam, molestias quos, dolorum consequuntur nisi deserunt\
                        omnis id illo sit cum qui. Eaque, dicta."

  ionRadioValue: number = 0;
  selectedPhotos: any[] = [];
  selectedOptions: any[] = [];
  options = {
    tools: [
            {id: 1, toolName: 'Drill'},
            {id: 2, toolName: 'Hand saw'},
            {id: 3, toolName: 'Hammer'},
            {id: 4, toolName: 'Wrench'}
          ],
    items: [
            {id: 0, itemName: 'Item 1'},
            {id: 1, itemName: 'Item 2'},
            {id: 2, itemName: 'Item 3'},
            {id: 3, itemName: 'Item 4'},
            {id: 4, itemName: 'Item 5'}
          ],
    systems: [
              {
                name: 'languages',
                options: [
                  {value: '0', text: 'AHU-1'},
                  {value: '1', text: 'AHU-22'},
                  {value: '2', text: 'AHU-3'},
                  {value: '2', text: 'AI System'},
                  {value: '2', text: 'Autonomy System'},
                  {value: '2', text: 'Heat Trace System'},
                ],
              },
            ],
    pickerButtons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Confirm',
        handler: (index: any) => {
          console.log(`You selected: ${index.languages.text}`)
        }
      }
    ]
  }
  

  constructor(
              private route: ActivatedRoute, 
              private router : Router, 
              public fb: FormBuilder,
              public storage: Storage,
              public photoService: PhotoService,
              public appComponent: AppComponent
              ) {}

  
  async ngOnInit() {
    
    // await this.photoService.loadSaved();
    this.loadSourceFolder = await this.photoService.loadSourceFolderPhotos();
    // console.log(this.loadSourceFolder);
    this.loadDestFolder = await this.photoService.loadDestinationFolderPhotos();
    // console.log(this.loadDestFolder);
    
    // await this.getAllPhotos(this.selectedPhotos);
    // await this.photoService.loadFromNewDirectory();

    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.create();

    this.id = this.route.snapshot.params['id'];
    this.nome = this.route.snapshot.params['nome'];
    this.icon = this.route.snapshot.params['icon'];
    this.descriptionText = this.route.snapshot.params['descriptionText'];

    this.appComponent.pageName = this.nome;
    this.appComponent.pageId = this.id;

    // this.route.paramMap.subscribe(params => {
    //   // let name = params.get('name');
    //   this.name = params.get('name');
    // });

    // this.appComponent.pageName = "Project Overview";
    // this.appComponent.pageName = this.nome;

    this.listPageGroup = new FormGroup({
      issueForm: new FormControl(this.form,
                              [
                                Validators.required,
                                Validators.minLength(4),
                                Validators.maxLength(100),
                                // forbiddenNameValidator(/bob/i),
                              ]
                            )
    });
  }

  /**
   * Once it's called, the function either shows the description of the entity
   * or hides it.
   */
  showDescription() {
    this.isVisible = !this.isVisible;
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
   * Once it's called, the function retrieves the input's value.
   */
  async onSubmit() {
    if (this.inputContent) {
      await this.storage.set('id', this.inputContent);
      this.retrievedFromLS = await this.storage.get('id');
      // console.log(this.inputContent);
    }
    else if (this.selectedOptions) {
      // console.log(this.selectedOptions);
    }
  }

  /**
   * Once it's called, the function either shows the description of the entity
   * or hides it.
   * @param isOpen
   */
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  /**
   * Once it's called, the function either shows the description of the entity
   * or hides it.
   * @param isOpen
   */
  openGalery(isOpen: boolean) {
    this.isGaleryOpen = isOpen;
  }

  /**
   * 
   */
  get issueForm() {
    return this.listPageGroup.get('issueForm');
  }

  /**
   * Once it's called, the function returns the input's value.
   * @returns string
   */
  getIssue(): string {
    // console.log(this.listPageGroup.value);
    return this.listPageGroup.value;
  }

  /**
   * Once it's called, the function retrieves the
   * selected radio button's value.
   */
  checkValue(event: number){
    // console.log('Selected value: ', this.selectedValue);
  }

  /**
   * 
   */
  async takePic() {
    this.photoService.addNewToGallery();
    this.storedPhoto = JSON.stringify(this.photoService.imagePath);
    await this.storage.set('id', this.storedPhoto);
  }

  /**
   * Once it's called, the function deletes the selected photo from
   * one directory and saves it to another directory.
   */
  async photoSelection(oldPhotoGalery: any[]) {

    // check whether the galery is empty or not
    if(!oldPhotoGalery.length) {
      console.log('There are no photos to be saved to the new galery.');
    }
    else
    {
      console.log('The selected photos will be saved to another directory');
      // const setPhotosToNewArrey = await this.getAllPhotos();
      // console.log(this.selectedPhotos);
      const movePhoto = await this.photoService.movePhotos("/photos_original", "/photos_processed");
      this.photoService.photos = [];      
    }    
  } 

  // /**
  //  * 
  //  * @returns 
  //  */
  // async getAllPhotos(){

  //   const getPhotos = await Preferences.get({
  //     key: this.photoService.PHOTO_STORAGE
  //   })
    
  //   console.log(this.photoService.PHOTO_STORAGE);
  //   console.log(getPhotos);

  //   const photos = JSON.parse(getPhotos.value as string);

  //   for (let photo of photos) {
  //     this.selectedPhotos.push(photo);
  //   }
    
  //   console.log(this.selectedPhotos);
  // }
}
