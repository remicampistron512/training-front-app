// flash.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Flash, BootstrapAlertType } from '../../model/flash/flash.model';

@Injectable({ providedIn: 'root' })
export class FlashService {
  private readonly _flashes$ = new BehaviorSubject<Flash[]>([]);
  readonly flashes$ = this._flashes$.asObservable();

  show(type: BootstrapAlertType, text: string, opts: Partial<Flash> = {}): string {
    const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random());
    const flash: Flash = {
      id,
      type,
      text,
      dismissible: opts.dismissible ?? true,
      timeoutMs: opts.timeoutMs ?? 0,
      payload: opts.payload,
    };

    this._flashes$.next([...this._flashes$.value, flash]);

    if (flash.timeoutMs && flash.timeoutMs > 0) {
      window.setTimeout(() => this.remove(id), flash.timeoutMs);
    }

    return id;
  }

  success(text: string, timeoutMs = 3000) { return this.show('success', text, { timeoutMs }); }
  danger(text: string, timeoutMs = 5000)  { return this.show('danger', text,  { timeoutMs }); }
  info(text: string, timeoutMs = 3000)    { return this.show('info', text,    { timeoutMs }); }
  warning(text: string, timeoutMs = 4000) { return this.show('warning', text, { timeoutMs }); }

  remove(id: string): void {
    this._flashes$.next(this._flashes$.value.filter(f => f.id !== id));
  }

  clear(): void {
    this._flashes$.next([]);
  }
}
