import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Task } from '../task.model';
import { TaskStorageService } from '../../../shared/task-storage/task-storage.service';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [
    CommonModule, // Necessário para usar *ngIf
    TaskFormComponent
  ],
  templateUrl: './task-edit.component.html',
})
export class TaskEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskStorageService);

  // Usamos um signal para armazenar a tarefa que será editada.
  // Começa como `undefined` até que os dados sejam carregados.
  taskToEdit = signal<Task | undefined>(undefined);

  ngOnInit(): void {
    // Pega o parâmetro 'id' da URL da rota atual.
    const taskId = this.route.snapshot.paramMap.get('id');

    if (taskId) {
      // Se um ID foi encontrado, busca a tarefa no serviço.
      const existingTask = this.taskService.getTaskById(taskId);
      this.taskToEdit.set(existingTask);
    } else {
      // Se não houver ID, talvez redirecionar para a página de erro ou para a lista.
      this.router.navigate(['/tasks']);
    }
  }

  /**
   * Chamado quando o task-form emite o evento (save).
   * @param updatedTaskData A tarefa com os dados atualizados do formulário.
   */
  handleSave(updatedTaskData: Task): void {
    this.taskService.updateTask(updatedTaskData);
    this.router.navigate(['/tasks']);
  }
}
