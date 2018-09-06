import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private _http: HttpClient) { }

  create(task){
    return this._http.post('/task', task);
  }

  getAll(){
    return this._http.get('/task');
  }
  
  getOne(id){
    return this._http.get(`/task/${id}`);
  }
  
  update(id, task){
    return this._http.put(`/task/${id}`, task);
  }

  delete(id){
    return this._http.delete(`/task/${id}`);
  }

}
