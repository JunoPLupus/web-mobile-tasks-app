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

  // Usaremos apenas 'Estudos' e 'Trabalho' no exemplo.
  // No futuro, isso pode ser um ID referenciando uma tabela de Tags.
  category: 'Estudos' | 'Trabalho' | 'Casa';

  description?: string;
  priority: TaskPriority;

  startDate: Date;
  endDate?: Date;

  reminder: TaskReminder;
  repetition: TaskRepetition;

  completionHistory?: Date[];
}
