import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User {
  id: number = 0;
  email: string = '';
  username: string = '';
  password: string = '';
  enabled: boolean = true;
  transactions: any[] = [];
  categories: any[] = [];
  createdAt: Date = new Date();
}
