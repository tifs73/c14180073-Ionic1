import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  FotoService: any;

  constructor() {}

  tebak : number;
  output : string;
  srnd : number = Math.floor(Math.random() * 10);
  foto : boolean = false;

  random() {
    var counter = 0;
    if (counter == 0) {
      if (this.tebak == this.srnd) {
        this.output = "Jawaban berhasil di tebak!";
        this.foto = true;
      } else if (this.tebak < this.srnd) {
        this.output = "Jawaban terlalu kecil"
      } else if (this.tebak > this.srnd) {
        this.output = "Jawaban terlalu besar"
      }
    }
  }

}
