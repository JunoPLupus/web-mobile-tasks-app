import {Component, computed, inject, Signal, signal} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TaskStorageService } from '../../../shared/task-storage/task-storage.service';
import { Task, TaskStatus } from '../task.model';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TaskListItemComponent } from './task-list-item.component';
import { AddTaskButtonComponent } from './add-task-button.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,

    MatChipsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,

    TaskListItemComponent,
    AddTaskButtonComponent
  ],
  providers: [
    DatePipe
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})

export class TaskListComponent {

  private taskService = inject(TaskStorageService);
  private datePipe = inject(DatePipe);

  categories = this.taskService.availableCategories;

  selectedStatus = signal<TaskStatus>('Pendente'); // O signal para o filtro ativo agora pode ser inicializado com o valor que queremos.
  selectedCategory = signal<string>('Todos');
  selectedDate = signal<Date>(new Date()); // Começa com data atual

  private tasksForSelectedDate: Signal<Task[]>;

  constructor() {
    this.tasksForSelectedDate = this.taskService.getTasksForDate(this.selectedDate);  // O serviço nos devolve um novo signal que já é reativo à nossa data selecionada.
  }

  private tasksFilteredByCategory = computed(() => {

    const tasks = this.tasksForSelectedDate();
    const categoryFilter = this.selectedCategory();

    return tasks.filter(task => {
      if (categoryFilter === 'Todos') return true;

      return task.category === categoryFilter;
    }); // fim 'tasks.filter'

  }); // fim 'tasksFilteredByCategory'

  tasksCount = computed(() => {
    const tasks = this.tasksFilteredByCategory();

    return {
      pendentes: tasks.filter(t => t.status === 'Pendente').length,
      concluidas: tasks.filter(t => t.status === 'Completa').length,
      perdidas: tasks.filter(t => t.status === 'Perdida').length
    }
  }); // fim 'tasksCount'

  displayDate = computed(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (today.toDateString() === this.selectedDate().toDateString()) {
      return 'Hoje';
    }
    else if (tomorrow.toDateString() === this.selectedDate().toDateString()) {
      return 'Amanhã';
    }
    else {
      return this.datePipe.transform(this.selectedDate(), 'dd/MM');
    }
  }); // fim 'displayDate'


  groupedTasks = computed(() => {

    const tasks = this.tasksFilteredByCategory();
    const statusFilter = this.selectedStatus();

    const filteredTasks = tasks.filter(task => // Filtra por status
      task.status === statusFilter
    );


    // Agrupa o resultado final após ter sido filtrado por data, categoria e status.
    const grouped = filteredTasks.reduce((collection, task) => {

      const category = task.category; // categoria da tarefa atual

      if (!collection[category]) {
        collection[category] = []; // Cria a "caixa" da categoria se ela não existir. Ex.: collection['Trabalho'] = []
      }

      collection[category].push(task); // Coloca a "peça" (task) atual na caixa correta, ex.: collection['Trabalho'].push(task). Agora o collection é { Trabalho: [ { name: 'Relatório', ... } ] }.
      return collection; // Devolve as caixas para a próxima rodada

    }, {} as Record<string, Task[]>); // Começamos com um conjunto de caixas vazio

    return Object.entries(grouped); // converte esse objeto em um array para que o Angular possa percorrê-lo facilmente no template.
  });

  changeDate(event: MatDatepickerInputEvent<Date>) : void {
    if (event.value) {
      this.selectedDate.set(event.value);
    }
  }

  changeCategory(category: string) : void {
    this.selectedCategory.set(category);
  }


  changeFilter(filter: TaskStatus) {
    this.selectedStatus.set(filter);
  }
}
