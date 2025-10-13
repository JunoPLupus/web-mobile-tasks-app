import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Task } from '../task.model';
import { TaskStorageService } from '../../../shared/task-storage/task-storage.service';

// Importações do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe,

    // Módulos do Material
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskStorageService);

  // Signal para armazenar os dados da tarefa a ser exibida.
  task = signal<Task | undefined>(undefined);

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');

    if (taskId) {
      const foundTask = this.taskService.getTaskById(taskId);
      this.task.set(foundTask);
    } else {
      // Se não houver ID, volta para a lista.
      this.router.navigate(['/tasks']);
    }
  }
}
