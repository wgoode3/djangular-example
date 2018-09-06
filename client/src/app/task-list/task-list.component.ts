import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  tasks = [];

  constructor(private _taskService: TaskService) { }

  ngOnInit() {
    this.getTasks();
  }

  @Output() taskEvent = new EventEmitter();

  getTasks(){
    this._taskService.getAll().subscribe( data => {
      this.tasks = data['tasks'];
    });
  }

  edit(id){
    this.taskEvent.emit(id);
  }

}
