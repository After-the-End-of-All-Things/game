import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  authType: 'login'|'register' = 'login';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
  });

  constructor(public menu: MenuController, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm.controls.email.errors
  }

  ionViewDidEnter() {
    this.menu.enable(false);
    this.menu.swipeGesture(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
    this.menu.swipeGesture(true);
  }

  login() {
    if(!this.loginForm.value.email || !this.loginForm.value.password) return;

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
  }

  register() {
    if(!this.registerForm.value.email || !this.registerForm.value.password || !this.registerForm.value.username) return;

    this.authService.register(this.registerForm.value.email, this.registerForm.value.password, this.registerForm.value.username);
  }

}
