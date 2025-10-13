import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { Task } from '../task.model';

// Importações do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Essencial para formulários reativos
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  // --- Entradas e Saídas do Componente ---

  @Input() task?: Task; // Recebe uma tarefa existente para o modo de edição. É opcional.

  @Output() save = new EventEmitter<Task>(); // Emite o objeto da tarefa (novo ou atualizado) quando o formulário é salvo.

  // --- Injeção de Dependências ---
  private fb = inject(FormBuilder);
  private locationService = inject(Location);  // <-- Injete o serviço Location

  // --- Estado Interno do Componente ---
  taskForm!: FormGroup;
  isEditMode = false;
  showAdvanced = signal(false);

  // Dados para os selects do formulário
  categories = ['Estudos', 'Trabalho', 'Casa'];
  reminders = ['Nenhum', '30m', '1h', '1d', '1w'];
  repetitions = ['Nenhuma', 'Diária', 'Semanal', 'Mensal'];

  ngOnInit(): void {
    this.isEditMode = !!this.task; // Define se está em modo de edição
    if (this.isEditMode) {
      this.showAdvanced.set(true); // No modo de edição, sempre mostra campos avançados
    }
    this.initForm();
  }

  formatPriorityLabel(value: number): string {
    if (value === 1) return 'Baixa';
    if (value === 2) return 'Média';
    if (value === 3) return 'Alta';
    return '';
  }

  private initForm(): void {
    // Mapeia a prioridade de texto para número
    const priorityMap: { [key: string]: number } = { 'Baixa': 1, 'Média': 2, 'Alta': 3 };
    const initialPriorityValue = this.task ? priorityMap[this.task.priority] : 1;


    this.taskForm = this.fb.group({
      // O valor inicial de cada campo depende se estamos editando ou criando
      name: [this.task?.name || '', Validators.required],
      category: [this.task?.category || 'Estudos', Validators.required],
      description: [this.task?.description || ''],
      priority: [initialPriorityValue, Validators.required],
      startDate: [this.task?.startDate || new Date()],
      endDate: [this.task?.endDate || null],
      reminder: [this.task?.reminder || 'Nenhum'],
      repetition: [this.task?.repetition || 'Nenhuma'],
      // Este campo controla a checkbox "continuar adicionando"
      keepAdding: [false]
    });
  }


  goBack(): void {
    this.locationService.back();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return; // Impede o envio se o formulário for inválido
    }

    const formValue = this.taskForm.value;

    // Converte o valor numérico do slider de volta para texto antes de salvar
    const priorityText = this.formatPriorityLabel(formValue.priority);


    // Monta o objeto da tarefa para ser emitido
    const taskData: Task = {
      // Se estiver em modo de edição, mantém o ID e status originais
      id: this.task?.id || '', // O ID real será gerado no service
      status: this.task?.status || 'Pendente',
      // Pega os valores do formulário
      ...formValue,
      priority: priorityText // Usa o valor convertido
    };

    this.save.emit(taskData);

    // Se a opção "continuar adicionando" estiver marcada, reseta o formulário
    if (formValue.keepAdding) {
      this.taskForm.reset({
        name: '',
        description: '',
        category: 'Estudos',
        priority: 'Baixa',
        startDate: new Date(),
        endDate: null,
        reminder: 'Nenhum',
        repetition: 'Nenhuma',
        keepAdding: true // Mantém a opção marcada
      });
    }
  }
}
