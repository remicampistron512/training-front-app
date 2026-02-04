// password-demo.service.ts (or a simple util file)
import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

@Injectable({ providedIn: 'root' })
export class HashService {
  private readonly saltRounds = 10; // 10–12 is typical; higher = slower

  async hashPassword(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(plain, salt);
  }

  async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
