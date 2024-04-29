import { Injectable } from '@angular/core';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { CapacitorException, Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
// import { Storage } from '@ionic/storage-angular';
import { ListPage } from '../list/list.page';


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public getResult: any;

  public readFileData: any;

  imageNewSRC: any;
  imagePath: string | undefined;
  public photos: UserPhoto[] = [];
  public selectedPhotos: UserPhoto[] = [];
  // public newGaleryPhotos: newGaleryPhoto[] = [];
  public newGaleryPhotos: any[] = [];
  public PHOTO_STORAGE: string = 'photos';
  public NEW_PHOTO_STORAGE: string = 'newGaleryPhotos';
  public destDirDataStorage: any[] = [];
  // public sourceDirDataStorage: any[] = [];
  public webView: any[] = [];
  public dir = Directory.Data;
  public sourceFolder: string = "/photos_original";
  public destFolder: string = "/photos_processed";
  public renderedPhotos: renderedPhoto[] = [];
  public renderedPhoto: string = "";
  public newGaleryValueString: string = "";

  public capacitorStorageKey: string = "";

  constructor(
    // public storage: Storage,
    // public listPage: ListPage,
  ) { }

  public async addNewToGallery() {
    
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

    // this.photos.unshift({
    //   filepath: "soon...",
    //   webviewPath: capturedPhoto.webPath!
    // });
    
    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    // // unshifiting to newGaleryPhotos as well
    // this.newGaleryPhotos.unshift(savedImageFile);
    
    this.imagePath = capturedPhoto.webPath;

    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    })

    console.log(JSON.stringify(this.photos));

    // Saving photo to be later rendered in association with the destination folder
    // this.newGaleryValueString = JSON.stringify(this.newGaleryPhotos).replace('photos_original', 'photos_processed');
    // console.log(newGaleryValueString);

    // Preferences.set({
    //   key: this.NEW_PHOTO_STORAGE,
    //   value: newGaleryValueString
    // })
  }

  private async savePicture(photo: Photo) {
    // Convert photo to base64 format, required byilesystem API to save
    const base64Data = await this.readAsBase64(photo);

    // Write the file to the data directory
    const fileName = '/photos_original/' + Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    const storeSourceWebView = this.webView.unshift({
      webviewPath: photo.webPath
    });

    // console.log(base64Data);

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };

  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSourceFolderPhotos(): Promise<boolean> {
    // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

    // console.log(this.photos);

    if (value === null){
      return false;
    }
    else {
      try {
        // Display the photo by reading into base64 format
        for (let photo of this.photos) {
          // Read each saved photo's data from the Filesystem
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
          });
          // console.log(photo.filepath);
          // Web platform only: Load the photo as base64 data
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
          // console.log(file);
          
          // console.log(photo.webviewPath);
        }
        return true;
      }
      catch (error) {
        console.error('Error reading the file:', error);
        return false;
      } 
    } 
  }

  public async loadDestinationFolderPhotos(): Promise<boolean> {

    // Retrieve cached photo array data
    const { value } = await Preferences.get({ key: this.NEW_PHOTO_STORAGE });
    this.newGaleryPhotos = (value ? JSON.parse(value) : []) as newGaleryPhoto[];

    if (value === null) {
      return false;
    }
    else {
      try {
        // Display the photo by reading into base64 format
        for (let newGaleryPhoto of this.newGaleryPhotos) {
          // Read each saved photo's data from the Filesystem
          const readFile = await Filesystem.readFile({
            path: newGaleryPhoto.filepath,
            directory: Directory.Data
          });
          // console.log(photo.filepath);
          // Web platform only: Load the photo as base64 data
          newGaleryPhoto.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
          // this.renderedPhoto = newGaleryPhoto.webviewPath;
          // console.log(readFile);
          
          // console.log(photo.webviewPath)
        }
        return true;
      }
      catch (error) {
        console.error('Error reading the file:', error);
        // console.log(this.renderedPhoto.length);
        return false;
      } 
    }
  }

  // public async compareCacheDirectoryToDestDirectory(cacheDirectory: any, destDirectory: any) {

  // }

  public async movePhotos(sourcePath: any, destinationPath: any) {

    // Check if destination folder exists
    const destDirExists = await this.checkFolder(Directory.Data, destinationPath);
      if (destDirExists == false) {
        console.log(`Destination folder "${destinationPath}" does not exist or is empty.`);
        const makeDestDirectory = await Filesystem.mkdir({directory: Directory.Data, path: destinationPath});
        console.log(`Destination folder "${destinationPath}" was created.`);
        // return;
      }
      else {
        console.log(`Destination folder "${destinationPath}" does already exist.`);
        // return;
      }

    //Reads source folder
    const sourceDirRead = await Filesystem.readdir({directory: Directory.Data, path: sourcePath});

    // Loop through source files
    for (const file of sourceDirRead.files) {
      const sourceFile = `${sourcePath}/${file.name}`;
      const destinationFile = `${destinationPath}/${file.name}`;

      // Read file content
      // const readFileData = await Filesystem.readFile({path: sourceFile, directory: Directory.Data, encoding: Encoding.UTF8});
      const readFileData = await Filesystem.readFile({path: sourceFile, directory: Directory.Data, encoding: Encoding.UTF8});


      // Write file content to destination 
      try {
        await Filesystem.writeFile({
          path: destinationFile,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
          data: readFileData.data
        });
      } catch (err) {
        console.error(`Error copying file "${sourceFile}" to "${destinationFile}":`, err);
        continue; //Continue processing other files even if there's an error
      }
    
      // Delete original file (optional)
      await Filesystem.deleteFile({path: sourceFile, directory: Directory.Data});
    }

    // this.getResultFromCS(this.PHOTO_STORAGE, this.NEW_PHOTO_STORAGE);
    this.setPhotosProcessedToCS(this.PHOTO_STORAGE, this.NEW_PHOTO_STORAGE);
    
    console.log(`Photos successfully moved from "${sourcePath}" to "${destinationPath}".`);
    await this.loadSourceFolderPhotos();

     await this.loadDestinationFolderPhotos();
  }

  /**
   * 
   * @param directory 
   * @param path 
   * @returns 
   */
  private async checkFolder(directory: Directory, path: string): Promise<boolean> {
    try {
      await Filesystem.stat({directory:directory, path: path});
      return true;
    } catch (checkDirException: any) {
      if (checkDirException['message'] === 'File does not exist') {
        return false;
      } else {
        return false;
        // throw checkDirException;
      }
    }
  }
  

  /**
   * In the Capacitor Storage (CS), changes the substring "photos_original", contained in the "filepath" attribute value, to 
   * 'photos_processed'. Then, the new "filepath" is used in the loadDestinationFolderPhotos() function to retrieve data from 
   * the FileSystem storage and render the photos which are set to the "photos_processed" directory.
   */
  private async setPhotosProcessedToCS(oldKey: string, newKey: string) {
    
    // Gets the results using, respectively, the old key and the new key.
    const getResulstOldKey = await Preferences.get({key: oldKey});
    const getResultsNewKey = await Preferences.get({key: newKey});

    // changes the filepath from 'photos_original' to 'photos_processed'
    this.newGaleryValueString = (getResulstOldKey.value as string).replaceAll('photos_original', 'photos_processed');

    // In this first scenario, only the old key returns a not null value, meaning that its correspondent value 
    // is set in the Capacitor Storage.
    if (getResulstOldKey && getResulstOldKey.value !== null && getResultsNewKey.value == null) {

      // Delete the original values from CapacitorStorage.
      await Preferences.remove({key: oldKey});
    
      // Save the new values on CapacitorStorage.
      await Preferences.set({key: newKey, value: this.newGaleryValueString});

    }
    // In this case, both keys return a not null value, meaning that their correspondent values are set
    // in the Capacitor Storage.
    else if (getResulstOldKey && getResulstOldKey.value !== null && getResultsNewKey && getResultsNewKey.value !== null) {
      
      // Turns newKey's and oldKey's correspondent values into objects.
      const valuesString = (getResultsNewKey.value) + (this.newGaleryValueString);

      // Conform valuesString to the JSON.parse() method's requirements of its argument.
      const allSquareBracketsRemoved = valuesString.replaceAll(/[\[\]']+/g,'');
      const objectsSeparated = allSquareBracketsRemoved.replaceAll(/\}+/g, '},');
      const removeAdditionalComma = objectsSeparated.replaceAll(",,", ",")
      const sliceLastComma = removeAdditionalComma.slice(0,-1);
      const newValueString = '[' + sliceLastComma + ']';
      const valuesObject = JSON.stringify(JSON.parse(newValueString));

      // Set the valuesObject object as value to the Capacitor Storage
      await Preferences.set({key: newKey, value: valuesObject});
      
      // Delete the original values from CapacitorStorage.
      await Preferences.remove({key: oldKey});

    }
  }

}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}


export interface newGaleryPhoto {
  filepath: string;
  webviewPath?: string;
}
export interface renderedPhoto {
  src: string;
}
