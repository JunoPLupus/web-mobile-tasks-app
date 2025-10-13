import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskStatus } from '../../features/tasks/task.model';
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos

@Injectable({
  providedIn: 'root'
})
export class TaskStorageService {

  // Usamos 'writableSignal' com `signal()` para criar um estado que podemos modificar.
  // É privado para que os componentes não possam modificá-lo diretamente, garantindo que toda alteração passe pelos métodos deste serviço.
  #tasks = signal<Task[]>([]);

  // Signal computado que processa as tarefas
  public tasksWithDynamicStatus = computed(() => {
    const now = new Date();
    // Pega as tarefas do signal original
    return this.#tasks().map(task => {
      // Verifica se a tarefa está pendente, tem uma data de término e se essa data já passou
      if (task.status === 'Pendente' && task.endDate && new Date(task.endDate) < now) {
        // Retorna uma CÓPIA da tarefa com o status alterado
        return { ...task, status: 'Perdida' as TaskStatus };
      }
      // Se não, retorna a tarefa original
      return task;
    });
  });

  // Expomos os dados como um `Signal` somente leitura (`ReadonlySignal`).
  // Os componentes se inscreverão a este signal para receber atualizações automáticas.
  public tasks = this.tasksWithDynamicStatus;

  // Filtra e retorna apenas as tarefas pendentes.
  public pendingTasks = computed(() => this.tasks().filter(task => task.status === 'Pendente'));

  // Podemos criar outros para 'Completas', 'Perdidas', etc.
  public completedTasks = computed(() => this.tasks().filter(task => task.status === 'Completa'));

  constructor() {
    // Carrega os dados iniciais quando o serviço é criado.
    // No futuro, aqui seria a chamada para uma API.
    this.loadInitialData();
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

  // --- MÉTODOS PÚBLICOS PARA MANIPULAR O ESTADO ---

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

    return this.tasks().find(task => task.id === id);
  }
}
