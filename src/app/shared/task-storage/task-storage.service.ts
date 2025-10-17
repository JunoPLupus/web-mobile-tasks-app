import { Injectable, signal, computed, effect, Signal } from '@angular/core';
import { Task, TaskStatus, TaskRepetition } from '../../features/tasks/task.model';
import { v4 as uuidv4, validate } from 'uuid';

function isSameDate(date1: Date, date2: Date): boolean { // Fora da classe, ou como um método privado estático

  if (!(date1 instanceof Date && !isNaN(date1.valueOf())) || !(date2 instanceof Date && !isNaN(date2.valueOf()))) {
    return false; // Retorna falso se alguma data for inválida
  }

  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}


@Injectable({
  providedIn: 'root'
})

export class TaskStorageService {

  #tasks = signal<Task[]>([]); // signal que pode ser modificado e é privado (#)
  #currentTime = signal(new Date());

  public allStoredTasks = this.#tasks.asReadonly();

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



  private loadInitialData() { // Cria os mocks de tarefas
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

  /**
   * Retorna um Signal computado que gera a lista de tarefas para uma data específica,
   * incluindo as ocorrências de tarefas recorrentes.
   * @param selectedDateSignal O Signal da data selecionada pelo usuário no componente.
   * @returns Um Signal que emite a lista de tarefas a ser exibida.
   */
  public getTasksForDate(selectedDateSignal : Signal<Date>): Signal<Task[]> {

    return computed(() => {
      const allStoredTasks = this.#tasks();
      const selectedDate = selectedDateSignal();
      const targetDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).getTime();
      const now = this.#currentTime();

      const occurrences : Task[] = [];

      // Separa as "regras" das tarefas normais e das "exceções"
      const rules = allStoredTasks.filter(task => task.repetition !== 'Nenhuma' && !task.recurrenceParentId);
      const exceptions = allStoredTasks.filter(task => !!task.recurrenceParentId);
      const normalTasks = allStoredTasks.filter(task => task.repetition === 'Nenhuma' && !task.recurrenceParentId);


      normalTasks.forEach(task => { // Processando as tarefas normais

        const start = new Date(task.startDate);
        const taskStartTimestamp = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
        let taskEndTimestamp = taskStartTimestamp; // Assume que termina no mesmo dia se não houver endDate

        if (task.endDate) {
          const end = new Date(task.endDate);
          taskEndTimestamp = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
        }

        if (targetDate >= taskStartTimestamp && targetDate <= taskEndTimestamp) {
          occurrences.push(task); // Inclui se o targetDate estiver entre o início e o fim
        }

      }); // final 'normalTasks.forEach'


      rules.forEach(task => { // Processando as regras para gerar ocorrências virtuais

        const start = new Date(task.startDate);
        const ruleStartTimestamp = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();

        if (targetDate < ruleStartTimestamp) {
          return; // Ainda não começou a ocorrer na data alvo.
        }

        if (task.endDate) {
          const end = new Date(task.endDate);
          const ruleEndTimestamp = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();

          if (targetDate > ruleEndTimestamp) {
            return;
          }
        }

        // Se chegou aqui, a regra PODE se aplicar a este dia.
        let isOccurringOnTargetDate = false;

        if (task.repetition === 'Diária') {
          isOccurringOnTargetDate = true;
        }

        // ... (Futura lógica Semanal/Mensal) ...

        if (isOccurringOnTargetDate) { // Cria a ocorrência virtual

          const virtualStartDate = new Date(targetDate);
          const [startHours, startMinutes] = new Date(task.startDate).toTimeString().slice(0, 5).split(':').map(Number);
          virtualStartDate.setHours(startHours, startMinutes);

          let virtualEndDate: Date;

          if (task.repetition === 'Diária') {
            // Tarefa termina no mesmo dia
            virtualEndDate = new Date(virtualStartDate);

            if (task.endDate) { // Se a tarefa tiver um horário 'fim' definido.
              const [endHours, endMinutes] = new Date(task.endDate).toTimeString().slice(0, 5).split(':').map(Number);
              virtualEndDate.setHours(endHours, endMinutes);

            } else {
              virtualEndDate.setHours(23, 59, 59, 999); // Horário padrão para o final da tarefa
            }
          } else {
            // Lógica para outras repetições (mantendo duração)
            const duration = this.calculateDuration(task);
            virtualEndDate = new Date(virtualStartDate.getTime() + duration);
          }

          const virtualTask: Task = {
            ...task,
            id: `${task.id}_${selectedDate.toISOString().slice(0, 10)}`, // ID virtual único
            startDate: virtualStartDate,
            endDate: virtualEndDate,
            recurrenceParentId: task.id,
            occurrenceDate: new Date(targetDate),
          };

          occurrences.push(virtualTask);
        }
      }); // final 'rules.forEach'

      let finalTasks = [...occurrences];

      exceptions.forEach(task => {
        // Garante que occurrenceDate é um objeto Date antes de chamar isSameDate
        if (task.occurrenceDate && isSameDate(task.occurrenceDate, new Date(targetDate))) {
          const virtualIndex = finalTasks.findIndex(t => t.id === task.recurrenceParentId);

          if (virtualIndex > -1) {
            finalTasks[virtualIndex] = task; // Substitui
          } else {
            finalTasks.push(task); // Adiciona se não houver virtual (caso raro)
          }
        }
      }); // final 'exceptions.forEach'

      return finalTasks.map(task => {
        if (task.status === 'Pendente' && task.endDate && new Date(task.endDate) < now) {
          return { ...task, status: 'Perdida' as TaskStatus }; // Aplica o status dinâmico 'Perdida' na lista final
        }
        return task;
      }); // final 'return finalTasks.map'

    }); // final 'return computed(() => { ... })'
  }

  private loadTasksFromStorage(): void {
    const storedTasks = localStorage.getItem('my-tasks');
    if (storedTasks) {

      try {
        // Precisamos converter as strings de data de volta para objetos Date
        const tasks = JSON.parse(storedTasks).map((task: any) => ({
          ...task,
          startDate: new Date(task.startDate),
          endDate: task.endDate ? new Date(task.endDate) : undefined,
          occurrenceDate: task.occurrenceDate ? new Date(task.occurrenceDate) : undefined,
          completionHistory : Array.isArray(task.completionHistory)
            ? task.completionHistory.map((date: string) => new Date(date))
            : undefined,
        }));
        this.#tasks.set(tasks);
      }
      catch (e) {
        console.error('Erro ao carregar tarefas do localStorage:', e);
        this.loadInitialData(); // Carrega mocks se o parse falhar
      }

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
   * Atualiza uma tarefa existente. Se for uma ocorrência virtual de uma tarefa
   * recorrente, cria uma "exceção" para persistir a alteração.
   * @param updatedTask - O objeto completo da tarefa com as alterações.
   */
  updateTask(updatedTask: Task) {

    if (updatedTask.recurrenceParentId && !validate((updatedTask.id))) {

      // Procurando se já existe uma exceção para este dia
      const existingException = this.#tasks().find(t =>
        t.recurrenceParentId === updatedTask.recurrenceParentId &&
        t.occurrenceDate && updatedTask.occurrenceDate &&
        isSameDate(t.occurrenceDate, updatedTask.occurrenceDate)
      );

      if (existingException) { // Se ela existe, apenas atualizamos seus dados
        const fullyUpdatedException = { ...updatedTask, id: existingException.id, repetition: 'Nenhuma' as TaskRepetition};

        this.#tasks.update(tasks =>
          tasks.map(task =>
            task.id === existingException.id ? fullyUpdatedException : task
          )
        );

      } else { // Se não existe, criamos uma nova exceção com um ID real

        const newException: Task = {
          ...updatedTask,
          id: uuidv4(), // Gera um novo ID real
          repetition: 'Nenhuma' // Exceções não se repetem
        };

        this.#tasks.update(currentTasks => [...currentTasks, newException]);
      }

    } else { // Se a tarefa não é uma ocorrência virtual, usamos a lógica simples de encontrar e substituir.

      this.#tasks.update(tasks =>
        tasks.map(task =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    }
  }

  /**
   * Muda o status de uma tarefa. Se for uma tarefa normal, atualiza.
   * Se for uma ocorrência virtual, cria uma "exceção" para registrar a mudança.
   * @param task - O objeto da tarefa (pode ser real ou virtual) que foi interagida.
   * @param newStatus - O novo status para a tarefa.
   */
  updateTaskStatus(task: Task, newStatus: TaskStatus) {

    if (task.recurrenceParentId) {

      const existingException = this.#tasks().find(t => // Verificando se já existe uma exceção para este dia.
        t.recurrenceParentId === task.recurrenceParentId &&
        new Date(t.occurrenceDate!).toDateString() === new Date(task.occurrenceDate!).toDateString()
      );

      if (existingException) { // Se ela existe, apenas atualizamos seu status
        this.updateTask({ ...existingException, status: newStatus });

      } else { // Se não existe, criamos uma nova tarefa 'filha' (exceção)

        const newException: Task = {
          ...task,
          id: uuidv4(),
          status: newStatus,
          repetition: 'Nenhuma' // Uma exceção é um evento único, não se repete.
        }

        this.#tasks.update( currentTasks => [...currentTasks, newException]); // Adicionamos a nova exceção ao nosso "banco de dados".
      }

    }
    else { // Se não for uma ocorrência, simplesmente encontramos a tarefa real e a atualizamos.

      this.#tasks.update(tasks =>
        tasks.map(t => {
          if (t.id === task.id) {
            return { ...t, status: newStatus }; // Retorna uma cópia da tarefa com o status atualizado
          }
          return t;
        })
      );
    }
  }

  /**
   * Encontra e retorna uma tarefa específica pelo seu ID.
   * @param id - O ID da tarefa a ser encontrada.
   * @returns O objeto da tarefa ou `undefined` se não for encontrado.
   */

  getTaskOrOccurrenceById(id: string): Task | undefined {
    // Importante: este método deve buscar na fonte original de dados (#tasks),
    // não na lista com status dinâmico, para garantir que você obtenha o estado real armazenado.

    const realTask = this.#tasks().find(task => task.id === id);
    if (realTask) {
      return realTask;
    }

    if (id.includes('_')) { // formato: parentId_YYYY-MM-DD
      const parts = id.split('_');
      const parentId = parts[0];
      const occurrenceDate = parts[1];
      const parentTask = this.#tasks().find(task => task.id === parentId);

      if (!parentTask) return undefined; // Se a "mãe" não for encontrada, não há o que fazer.

      const dateParts = occurrenceDate.split('-').map(Number);
      const targetDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
      //occurrenceDate + 'T00:00:00' // new Date("2025-10-17T00:00:00") é interpretado como MEIA-NOITE LOCAL.
      //const duration = this.calculateDuration(parentTask);

      const virtualStartDate = new Date(targetDate);
      const [startHours, startMinutes] = new Date(parentTask.startDate).toTimeString().slice(0, 5).split(':').map(Number);
      virtualStartDate.setHours(startHours, startMinutes);

      let virtualEndDate: Date = new Date(virtualStartDate);

      if (parentTask.repetition === 'Diária') { // Agora a lógica if/else pode sobrescrever este valor inicial
        // Tarefa termina no mesmo dia
        virtualEndDate = new Date(virtualStartDate);

        if (parentTask.endDate) { // Se a mãe tem hora de término, usa essa hora
          const [endHours, endMinutes] = new Date(parentTask.endDate).toTimeString().slice(0, 5).split(':').map(Number);
          virtualEndDate.setHours(endHours, endMinutes);

        } else { // Se não tem, usamos 23:59
          // Lógica futura para outras repetições (mantém a duração original)
          const duration = this.calculateDuration(parentTask);
          virtualEndDate = new Date(virtualStartDate.getTime() + duration); // Sobrescreve o valor inicial com o cálculo correto
        }
      }

      const virtualTask: Task = {
        ...parentTask,
        id: id,
        startDate: virtualStartDate,
        endDate: virtualEndDate,
        recurrenceParentId: parentTask.id,
        occurrenceDate: targetDate,
      };

      return virtualTask;
    }

    return undefined; // Se não for nem real nem virtual, não foi encontrado.
  }

  calculateDuration(task: Task): number {
    let duration : number;

    if (task.endDate) {
      duration = task.endDate.getTime() - task.startDate.getTime();
    } else {
      const startOfDay = new Date(task.startDate).setHours(0,0,0,0);
      const endOfDay = new Date(task.startDate).setHours(23,59,59,999);
      duration = endOfDay - startOfDay;
    }
    return duration;
  }
}
