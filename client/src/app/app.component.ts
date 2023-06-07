import { Component } from '@angular/core';

interface IMenuItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: IMenuItem[] = [
    {
      title: 'Home',
      url: '',
      icon: 'home'
    }
  ];

  constructor() {}
}
