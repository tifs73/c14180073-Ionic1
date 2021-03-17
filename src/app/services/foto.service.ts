import { Injectable } from '@angular/core';
import { Camera, CameraPhoto, CameraResultType, CameraSource, Capacitor, FilesystemDirectory, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';


const { camera, Filesystem, Storage } = Plugins;
@Injectable({
  providedIn: 'root'
})
export class FotoService {

  public datafoto : photo[] = [];
  private keyfoto : string = "foto";
  private platform : Platform
  
  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async tambahfoto() {
    const foto = await Camera.getPhoto ({
      resultType : CameraResultType.Uri,
      source : CameraSource.Camera,
      quality : 100
    })
    console.log(foto);

    //untuk menambahkan foto ke dalam data foto
    this.datafoto.unshift({
      filepath:"Load", 
      webviewpath:foto.webPath
    }); //unshift utk memasukan foto paling ditaruh paling atas

    Storage.set({
      key : this.keyfoto,
      value : JSON.stringify(this.datafoto)
    });
  }

  public async simpanfoto(foto : CameraPhoto) {
    const base64Data = await this.readAsBase64(foto);

    const namafile = new Date().getTime+'.jpeg';
    const simpanfile = await Filesystem.writeFile({
      path : namafile,
      data : base64Data,
      directory : FilesystemDirectory.Data
    });

    if (this.platform.is('hybrid')) {
      return {
        filePath : simpanfile.uri,
        webviewpath : Capacitor.convertFileSrc(simpanfile.uri)
      }
    } else {
      return {
        filePath  : namafile,
        webviewoath : foto.webPath
      }
    }
  }

  private async readAsBase64(foto : CameraPhoto) {
    if(this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path : foto.path
      });
      return file.data;
    }
    else {
      const response = await fetch(foto.webPath);
      const blob = await response.blob();
  
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  convertBlobToBase64 = (blob : Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
  reader.readAsDataURL(blob);
  });

  public async loadfoto() {
    const listfoto = await Storage.get({
      key : this.keyfoto
    });
    this.datafoto = JSON.parse(listfoto.value) || [];

    if (!this.platform.is('hybrid')) {
      for (let foto of this.datafoto) {
        const readfile = await Filesystem.readFile({
          path : foto.filepath,
          directory : FilesystemDirectory.Data
        });
        foto.webviewpath = `data:image/jpeg;base64, ${readfile.data}`;
      }
    }

    console.log(this.datafoto);
  }
}

//cara menampilkan hasil foto ke web
export interface photo {
  filepath : string; //sebagai folder/alamatnya
  webviewpath : string; //file name
}
