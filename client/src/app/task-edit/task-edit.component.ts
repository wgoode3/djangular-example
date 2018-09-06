import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {

  visible = false;
  task = {};
  errors = {};

  constructor(private _taskService: TaskService) { }

  ngOnInit() {
  }

  @Output() getNewTasks2 = new EventEmitter();

  getTask(id){
    this._taskService.getOne(id).subscribe( data => {
      this.task = data['task'];
      this.visible = true;
    });
  }

  cancel(){
    this.task = {};
    this.visible = false;
  }

  onSubmit(id){
    this._taskService.update(id, this.task).subscribe( data => {
      if(data['errors']){
        this.errors = data['errors'];
      }else{
        this.getNewTasks2.emit();
        this.task = {};
        this.visible = false;
      }
    });
  }

  delete(id){
    this._taskService.delete(id).subscribe( data => {
        this.getNewTasks2.emit();
        this.task = {};
        this.visible = false;
    });
  }

}
