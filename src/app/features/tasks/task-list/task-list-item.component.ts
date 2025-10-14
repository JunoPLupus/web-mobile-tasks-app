import { Component, Input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { Task } from '../task.model';
import { TaskStorageService } from '../../../shared/task-storage/task-storage.service';
import { RelativeDatePipe } from '../../../shared/pipes/relative-date.pipe';


@Component({
  selector: 'app-task-list-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,

    MatCardModule,
    MatCheckboxModule,
    MatIconModule,

    RelativeDatePipe
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss'
})

export class TaskListItemComponent {
  // Recebe o objeto da tarefa do componente pai (task-list).
  @Input() task!: Task; // '!' -> "Confia no pai, ele vai mandar o valor"

  private taskService = inject(TaskStorageService); // Injeta o serviço para poder chamar seus métodos.
  private router = inject(Router);

  onStatusChange(event: { checked: boolean }): void { // Método chamado quando o estado do checkbox muda.
    const newStatus = event.checked ? 'Completa' : 'Pendente';
    this.taskService.updateTaskStatus(this.task.id, newStatus);
  }

  navigateToDetail(): void {
    this.router.navigate(['/tasks/detail', this.task.id]);
  }
}
