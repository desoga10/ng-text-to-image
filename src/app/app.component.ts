import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { TextToImageService } from './service/text-to-image.service';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ng-background';
  imageurl!: SafeUrl;

  private textService = inject(TextToImageService);
  private sanitizer = inject(DomSanitizer);

  onSubmit(form: NgForm) {
    let formData = new FormData();
    formData.append('prompt', form.value.text);

    console.log('Your form data : ', form.value.text);
    this.textService.textToImage(formData).subscribe({
      next: (res) => {
        console.log(res);
        let TYPED_ARRAY = new Uint8Array(res);

        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');

        let base64String = btoa(STRING_CHAR);

        this.imageurl = this.sanitizer.bypassSecurityTrustUrl(
          'data:image/jpg;base64, ' + base64String
        );
        console.log(this.imageurl);
      },
      error: (error) => {
        alert(error);
      },
    });
  }
}
