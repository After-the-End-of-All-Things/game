import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor(private toastController: ToastController) {}

  public async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
      color,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }

  async notify(message: string) {
    await this.showToast(message, '');
  }

  async error(message: string) {
    await this.showToast(message, 'danger');
  }
}
