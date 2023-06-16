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
      icon: 'home',
    },
    {
      title: 'Town',
      url: 'town',
      icon: 'map',
    },
  ];

  public characterPages: IMenuItem[] = [
    {
      title: 'My Profile',
      url: 'me',
      icon: 'person',
    },
  ];

  constructor() {}
}
