// Tipos para garantir consistência e evitar erros de digitação
export type TaskStatus = 'Pendente' | 'Completa' | 'Perdida';
export type TaskPriority = 'Baixa' | 'Média' | 'Alta';
export type TaskReminder = 'Nenhum' | '30m' | '1h' | '1d' | '1w';
export type TaskRepetition = 'Nenhuma' | 'Diária' | 'Semanal' | 'Mensal' | 'Personalizada';

// A interface que define a estrutura de uma tarefa
export interface Task {
  id: string; // Identificador único e interno
  name: string;
  status: TaskStatus;

  category: 'Estudos' | 'Trabalho' | 'Casa'; // No futuro, isso pode ser um ID referenciando uma tabela de Tags.

  description?: string;
  priority: TaskPriority;

  startDate: Date;
  endDate?: Date;

  reminder: TaskReminder;
  repetition: TaskRepetition;

  completionHistory?: Date[];

  /**
   * Se esta tarefa for uma "exceção" (uma ocorrência específica de uma tarefa recorrente
   * que foi modificada ou completada), este campo conterá o ID da tarefa "mãe" (a regra).
   */
  recurrenceParentId?: string;

  /**
   * Se esta tarefa for uma "exceção", esta é a data original da ocorrência.
   * Ex: A tarefa "mãe" é "Levar o lixo" (diária), e o usuário completa a de hoje.
   * Criamos uma tarefa "exceção" com `occurrenceDate` sendo a data de hoje.
   */
  occurrenceDate?: Date;
}
