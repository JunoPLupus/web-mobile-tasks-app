// src/app/features/reports/reports-page/reports-page.component.ts

import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStorageService } from '../../../shared/task-storage/task-storage.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  private taskService = inject(TaskStorageService);

  // Pegamos a lista de tarefas "puras" diretamente do serviço
  // Nota: Precisaremos expor um signal com a lista #tasks no serviço.
  // Vamos fazer essa pequena alteração no serviço a seguir.
  private allTasks = this.taskService.allStoredTasks;

  // Estatística 1: Contagem total de tarefas salvas
  totalTaskCount = computed(() => this.allTasks().length);

  // Estatística 2: Contagem de tarefas por status
  tasksByStatus = computed(() => {
    return this.allTasks().reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  });

  // Estatística 3: Contagem de tarefas por categoria
  tasksByCategory = computed(() => {
    return this.allTasks().reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  });

  // Para poder usar Object.keys no template
  objectKeys = Object.keys as (obj: any) => string[];
}
