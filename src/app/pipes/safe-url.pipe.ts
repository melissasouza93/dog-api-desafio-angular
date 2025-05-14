import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, apiKey: string): SafeUrl {
    if (!value) return '';
    return this.sanitizer.bypassSecurityTrustUrl(`${value}?api_key=${apiKey}`);
  }
}
