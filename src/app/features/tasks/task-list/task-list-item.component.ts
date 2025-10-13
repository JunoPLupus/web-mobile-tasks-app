import { Component, Input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../task.model';
import { TaskStorageService } from '../../../shared/task-storage/task-storage.service';

// Importações do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import {Router} from '@angular/router';

@Component({
  selector: 'app-task-list-item',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,

    // Módulos do Material
    MatCardModule,
    MatCheckboxModule,
    MatIconModule
  ],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss'
})
export class TaskListItemComponent {
  // Recebe o objeto da tarefa do componente pai (task-list).
  // O '!' é um 'definite assignment assertion' que diz ao TypeScript:
  // "Confie em mim, este valor será fornecido pelo componente pai".
  @Input() task!: Task;

  // Injeta o serviço para poder chamar seus métodos.
  private taskService = inject(TaskStorageService);

  private router = inject(Router); // <-- Injete o Router

  // 3. Método chamado quando o estado do checkbox muda.
  onStatusChange(event: { checked: boolean }): void {
    const newStatus = event.checked ? 'Completa' : 'Pendente';
    this.taskService.updateTaskStatus(this.task.id, newStatus);
  }

  navigateToDetail(): void {
    // Mude o destino da navegação
    this.router.navigate(['/tasks/detail', this.task.id]);
  }
}
