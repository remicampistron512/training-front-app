import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Training} from '../../model/training/training.model';
import {environment} from '../../Environment'
import {User} from '../../model/user/user.model';
/* Contient tout le crud de l'application, à dispatcher dans des services plus spécifiques */
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http:HttpClient){}
  public getTrainings(){
    return this.http.get<Training[]>(environment.host+"/trainings");
  }
  public addTraining(training:Training){
    return this.http.post<Training>(environment.host+"/trainings", training);
  }
  public getTrainingById(id:string){
    return this.http.get<Training>(environment.host+"/trainings/"+id);
  }



  public updateTraining(id: string, training: Training) {
    return this.http.put<Training>(`${environment.host}/trainings/${id}`, training);
  }
  public removeTraining(id:string){
    return this.http.delete<Training>(`${environment.host}/trainings/${id}`);
  }
  public addUser(user: User){
    return this.http.post<User>(environment.host+"/users", user);
  }
  public getUsers(){
    return this.http.get<User[]>(environment.host+"/users");
  }
  public getUser(id:string){
    return this.http.get<User>(environment.host+"/users/"+id);
  }

  public getUserByEmail(email: string) {
    return this.http.get<User[]>(`http://localhost:3000/users`, {
      params: { email }
    });
  }

  public removeUser(id: string) {
    return this.http.delete<User>(`${environment.host}/users/${id}`);
  }
}
