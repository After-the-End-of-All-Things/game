import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AnnouncementService } from '@services/announcement.service';
import { NotificationsService } from '@services/notifications.service';
import { AuthService } from '../../services/auth.service';

import { marked } from 'marked';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public readonly externalLinks = [
    {
      name: 'Discord',
      icon: 'external-discord',
      url: 'https://discord.ateoat.com',
      color: '#5865f2',
    },
    {
      name: 'ateoat Blog',
      icon: 'external-blog',
      url: 'https://blog.ateoat.com',
      color: '#447d80',
    },
    {
      name: 'Reddit',
      icon: 'external-reddit',
      url: 'https://reddit.ateoat.com',
      color: '#fb4404',
    },
    {
      name: 'Twitter',
      icon: 'external-twitter',
      url: 'https://twitter.ateoat.com',
      color: '#1da1f2',
    },
    {
      name: 'Facebook',
      icon: 'external-facebook',
      url: 'https://facebook.ateoat.com',
      color: '#3b5998',
    },
  ];

  authType: 'login' | 'register' = 'login';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
    ]),
  });

  public loginError = '';
  public registerError = '';

  public announcement: any;

  public lastUpdate = '';

  constructor(
    public menu: MenuController,
    private authService: AuthService,
    private notificationService: NotificationsService,
    public announcementService: AnnouncementService,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.getFormattedAnnouncement();

    if (this.authService.isAuthenticated()) this.router.navigate(['/']);
  }

  async getFormattedAnnouncement() {
    this.announcement = await this.announcementService.getLatestAnnouncement();

    const renderer = new marked.Renderer();
    renderer.link = (href, title, text) =>
      `<a href="${href}" title="${title}" target="_blank" rel="noopener noreferrer">${text}</a>`;

    this.lastUpdate = marked(this.announcement?.summary ?? '', { renderer });
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
    if (
      !this.loginForm.value.email ||
      !this.loginForm.value.password ||
      !this.loginForm.valid
    )
      return;
    this.loginError = '';

    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
          this.notificationService.getNotifications();
        },
        error: () => {
          this.loginError = 'Invalid email or password.';
        },
      });
  }

  register() {
    if (
      !this.registerForm.value.email ||
      !this.registerForm.value.password ||
      !this.registerForm.value.username ||
      !this.registerForm.valid
    )
      return;
    this.registerError = '';

    this.authService
      .register(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.username,
      )
      .subscribe({
        next: () => {
          if (
            !this.registerForm.value.email ||
            !this.registerForm.value.password
          )
            return;

          this.authService
            .login(
              this.registerForm.value.email,
              this.registerForm.value.password,
            )
            .subscribe({
              next: () => {
                this.router.navigate(['/']);
                this.notificationService.getNotifications();
              },
              error: (err) => {
                this.registerError = err.error.message;
              },
            });
        },
        error: (err) => {
          this.registerError = err.error.message;
        },
      });
  }
}
