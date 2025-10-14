import {Injectable, signal, computed, effect} from '@angular/core';
import { Task, TaskStatus } from '../../features/tasks/task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})

export class TaskStorageService {

  #tasks = signal<Task[]>([]); // signal que pode ser modificado e é privado (#)
  #currentTime = signal(new Date());



  // Signal computado que processa as tarefas
  public tasksWithDynamicStatus = computed(() => {
    const now = this.#currentTime();

    return this.#tasks().map(task => { // Pega as tarefas do signal original

      if (task.status === 'Pendente' && task.endDate && new Date(task.endDate) < now) { // Verifica se a tarefa está pendente, tem uma data de término e se essa data já passou

        return { ...task, status: 'Perdida' as TaskStatus }; // Retorna uma CÓPIA da tarefa com o status alterado
      }

      return task; // Se não, retorna a tarefa original
    });
  });

  // Expomos os dados como um `Signal` somente leitura (`ReadonlySignal`).
  // Os componentes se inscreverão a este signal para receber atualizações automáticas.
  public tasks = this.tasksWithDynamicStatus;

  // Filtra e retorna apenas as tarefas pendentes.
  public pendingTasks = computed(() => this.tasks().filter(task => task.status === 'Pendente'));

  // Podemos criar outros para 'Completas', 'Perdidas', etc.
  public completedTasks = computed(() => this.tasks().filter(task => task.status === 'Completa'));

  /**
   * Gera uma lista de categorias únicas a partir das tarefas existentes,
   * sempre incluindo a opção 'Todos'.
   */
  public availableCategories = computed(() => {
    const tasks = this.#tasks();
    // Usa um Set para garantir que cada categoria apareça apenas uma vez.
    const uniqueCategories = new Set(tasks.map(task => task.category));
    // Converte o Set de volta para um Array e adiciona 'Todos' no início.
    return ['Todos', ...Array.from(uniqueCategories)];
  });

  constructor() {
    this.loadTasksFromStorage();

    setInterval(() => { // Atualiza o tempo atual a cada minuto para garantir que as tarefas sejam atualizadas.
      this.#currentTime.set(new Date());
    }, 60000);

    effect(() => { // Efeito para salvar as tarefas automaticamente no localStorage (se ainda não tiver)
      try {
        localStorage.setItem('my-tasks', JSON.stringify(this.#tasks()));
      } catch (e) {
        console.error('Erro ao salvar tarefas no localStorage:', e);
      }
    });
  }

  private loadInitialData() {
    const mockTasks: Task[] = [
      {
        id: uuidv4(),
        name: 'Finalizar relatório de desempenho',
        status: 'Pendente',
        category: 'Trabalho',
        priority: 'Alta',
        startDate: new Date('2025-10-11T09:00:00'),
        endDate: new Date('2025-10-11T19:00:00'),
        reminder: '1h',
        repetition: 'Nenhuma',
      },
      {
        id: uuidv4(),
        name: 'Revisar capítulo 5 do livro de Angular',
        status: 'Pendente',
        category: 'Estudos',
        priority: 'Média',
        startDate: new Date('2025-10-12T14:00:00'),
        endDate: new Date('2025-10-12T16:00:00'),
        reminder: '30m',
        repetition: 'Nenhuma',
      },
      {
        id: uuidv4(),
        name: 'Comprar itens para o jantar',
        status: 'Completa',
        category: 'Casa',
        priority: 'Baixa',
        startDate: new Date('2025-10-10T19:00:00'),
        endDate: new Date('2025-10-10T20:00:00'),
        reminder: 'Nenhum',
        repetition: 'Nenhuma',
        completionHistory: [new Date('2025-10-10T19:30:00')]
      }
    ];
    this.#tasks.set(mockTasks);
  }

  private loadTasksFromStorage(): void {
    const storedTasks = localStorage.getItem('my-tasks');
    if (storedTasks) {
      // Precisamos converter as strings de data de volta para objetos Date
      const tasks = JSON.parse(storedTasks).map((task: Task) => ({
        ...task,
        startDate: new Date(task.startDate),
        endDate: task.endDate ? new Date(task.endDate) : undefined,
      }));
      this.#tasks.set(tasks);
    } else {
      this.loadInitialData();
    }
  }

  /**
   * Adiciona uma nova tarefa à lista.
   * @param taskData - Dados da tarefa sem o ID.
   */
  addTask(taskData: Omit<Task, 'id' | 'status'>) {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(), // Gera um ID único
      status: 'Pendente' // Toda nova tarefa começa como pendente
    };

    // `update` é a forma segura e imutável de atualizar um signal.
    // Ele recebe o estado atual e retorna o novo estado.
    this.#tasks.update(currentTasks => [...currentTasks, newTask]);
  }

  /**
   * Atualiza uma tarefa existente.
   * @param updatedTask - O objeto completo da tarefa com as alterações.
   */
  updateTask(updatedTask: Task) {
    this.#tasks.update(tasks =>
      tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  }

  /**
   * Muda o status de uma tarefa específica.
   * @param taskId - O ID da tarefa a ser alterada.
   * @param newStatus - O novo status para a tarefa.
   */
  updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    this.#tasks.update(tasks =>
      tasks.map(task => {
        if (task.id === taskId) {
          // Retorna uma cópia da tarefa com o status atualizado
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  }

  /**
   * Encontra e retorna uma tarefa específica pelo seu ID.
   * @param id - O ID da tarefa a ser encontrada.
   * @returns O objeto da tarefa ou `undefined` se não for encontrado.
   */
  getTaskById(id: string): Task | undefined {
    // Importante: este método deve buscar na fonte original de dados (#tasks),
    // não na lista com status dinâmico, para garantir que você obtenha o estado real armazenado.

    return this.#tasks().find(task => task.id === id);
  }
}
