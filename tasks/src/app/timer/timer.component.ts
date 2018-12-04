import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  public results: String = "";

  constructor() { }

  ngOnInit() {
    this.repeatCalls(0);
  }

  private block(): Promise<void> {
    return new Promise((resolve)=>{
      setTimeout(function(){ 
        resolve();
       }, 2000);
    });
  }

  private repeatCalls(index: number): void {
    if(index >= (<any>this).input_array.length)
      return;
    this.block().then(()=>{
        this.results += (((<any>this).input_array[index])+" ");
        this.repeatCalls(index+1);
    })
  }

}
