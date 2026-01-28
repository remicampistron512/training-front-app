import {Component, OnInit} from '@angular/core';
import  {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from '../../app.routes';
import { Training } from '../../model/training.models';
import { Cart } from '../../services/cart';
import {Router} from '@angular/router';
@Component({
  selector: 'app-trainings',
  imports: [
    FormsModule
  ],
  templateUrl: './trainings.html',
  styleUrl: './trainings.css',
})
export class Trainings implements OnInit {
  listTrainings : Training[] | undefined;
  constructor(private cart: Cart, private router: Router) { }

  ngOnInit() : void {
    this.listTrainings = [
      {id: 1, name: 'Training 1', description: 'Description 1', price: 100,quantity:1},
      {id: 2, name: 'Training 2', description: 'Description 2', price: 200,quantity:1},
      {id: 3, name: 'Training 3', description: 'Description 3', price: 300,quantity:1}
    ]
  }


  onAddToCart(training: Training){
    this.cart.addTraining(training);
  }

}
