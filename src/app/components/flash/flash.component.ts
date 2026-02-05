// flash.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FlashService } from '../../services/flash/flash.service';
import { Flash } from '../../model/flash/flash.model';

@Component({
  selector: 'app-flash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flash.component.html',
})
export class FlashComponent {
  flashes$: Observable<Flash[]>;

  constructor(private flashService: FlashService) {
    this.flashes$ = this.flashService.flashes$;
  }

  close(id: string) {
    this.flashService.remove(id);
  }

  trackById(_: number, f: Flash) { return f.id; }
}
