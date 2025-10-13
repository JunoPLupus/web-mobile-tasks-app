import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStorageService } from '../../../shared/task-storage/task-storage.service';
import { Task, TaskStatus } from '../task.model';

// Importações do Angular Material
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { TaskListItemComponent } from './task-list-item.component';
import { AddTaskButtonComponent } from './add-task-button.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,

    // Adicione os módulos do Material aqui
    MatChipsModule,
    MatIconModule,

    TaskListItemComponent,
    AddTaskButtonComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  private taskService = inject(TaskStorageService);

  // O signal para o filtro ativo agora pode ser inicializado com o valor que queremos.
  activeFilter = signal<TaskStatus>('Pendente');

  groupedTasks = computed(() => {
    const tasks = this.taskService.tasks();
    const filter = this.activeFilter();

    const filteredTasks = tasks.filter(task => task.status === filter);

    const grouped = filteredTasks.reduce((acc, task) => {
      const category = task.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    return Object.entries(grouped);
  });

  // Este método não é mais necessário se usarmos mat-chip-listbox com two-way binding
  // mas vamos manter por enquanto para uma abordagem mais simples.
  changeFilter(filter: TaskStatus) {
    this.activeFilter.set(filter);
  }

  tasksCount = computed(() => ({
    pendentes: this.taskService.tasks().filter(t => t.status === 'Pendente').length,
    concluidas: this.taskService.tasks().filter(t => t.status === 'Completa').length,
    perdidas: this.taskService.tasks().filter(t => t.status === 'Perdida').length,
  }));
}
