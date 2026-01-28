import { Injectable } from '@angular/core';
import {Training} from '../model/training.models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  listTrainings: Training[] = [];
  addTraining (training: Training){
    this.listTrainings.push(training);
  }
}
