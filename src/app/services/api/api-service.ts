import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Training} from '../../model/training/training.model';
import {environment} from '../../Environment'

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http:HttpClient){}
  public getTrainings(){
    return this.http.get<Training[]>(environment.host+"/trainings");
  }
  public getTraining(id:number){
    return this.http.get<Training>(environment.host+"/training/"+id);
  }
}
