import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  authorId!: number;
  constructor() {}

  generateAuthorId(): void {
    if (!this.authorId) {
      this.authorId = Math.floor(Math.random() * 500) + 1;
    }
  }
}
