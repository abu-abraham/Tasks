import { Component,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver, } from '@angular/core';
import { TimerComponent } from './timer/timer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public input_array: String[] = [];
  private componentRef;

  @ViewChild('timercontainer', { read: ViewContainerRef }) entry: ViewContainerRef;
  constructor(private resolver: ComponentFactoryResolver) {
    this.initialize();
  }

  private initialize(): void {
    let end = 'z'.charCodeAt(0)+1;
    for (let i = 'a'.charCodeAt(0); i < end; i++){
      let temp: String = new Array(4).fill(String.fromCharCode(i)).join('');
      this.input_array.push(temp);
    }
  }

  public createComponent(): void {
    const factory = this.resolver.resolveComponentFactory(TimerComponent);
    this.componentRef = this.entry.createComponent(factory);
    this.componentRef.instance = Object.assign(this.componentRef.instance,this);
  }

}
