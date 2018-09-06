import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {

  newTask = {};
  errors = {};

  constructor(private _taskService: TaskService) { }

  ngOnInit() {
  }

  @Output() getNewTasks = new EventEmitter();

  onSubmit(){
    this._taskService.create(this.newTask).subscribe( data => {
      if(data['errors']){
        this.errors = data['errors'];
      }else{
        this.getNewTasks.emit();
        this.newTask = {};
      }
    });
  }

}
