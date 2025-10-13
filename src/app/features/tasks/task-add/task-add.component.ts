import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Task } from '../task.model';
import { TaskStorageService } from '../../../shared/task-storage/task-storage.service';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [
    TaskFormComponent // Importamos nosso formulário reutilizável
  ],
  templateUrl: './task-add.component.html',
  // Não precisamos de um arquivo .scss para este componente simples
})
export class TaskAddComponent {
  private taskService = inject(TaskStorageService);
  private router = inject(Router);

  /**
   * Este método é chamado quando o componente filho (task-form)
   * emite o evento (save).
   * @param taskData Os dados da tarefa vindos do formulário.
   */
  handleSave(taskData: Task): void {
    // Remove o ID, pois o serviço irá gerar um novo.
    // Omit<Task, 'id'> é um tipo que representa a Task sem o campo 'id'.
    const { id, ...newTaskData } = taskData;

    this.taskService.addTask(newTaskData as Omit<Task, 'id' | 'status'>);

    // Se a opção "continuar adicionando" NÃO estiver marcada no formulário,
    // navega de volta para a lista principal.
    // O formulário já tem um campo 'keepAdding' que podemos verificar.
    if (!taskData['keepAdding' as keyof Task]) {
      this.router.navigate(['/tasks']);
    }
  }
}
