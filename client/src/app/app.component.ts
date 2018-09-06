import { Component, ViewChild } from '@angular/core';
import { TaskEditComponent } from './task-edit/task-edit.component';
import { TaskListComponent } from './task-list/task-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tasks';

  @ViewChild('child')
  private child: TaskEditComponent;

  @ViewChild('child2')
  private child2: TaskListComponent;

  dataFromChild(){
    this.child2.getTasks();
  }

  dataFromChild2(){
    this.child2.getTasks();
  }

  dataFromTask(id){
    this.child.getTask(id);
  }

}
