import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule} from '@angular/material/slider';

import {Task, TaskPriority} from '../task.model';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    // Se ambas as datas existirem e a data de início for posterior à de término
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      // Retorna um objeto de erro. O nome 'dateRange' pode ser o que quisermos.
      return { dateRange: true };
    }

    // Se a validação passar, retorna null
    return null;
  };
}

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

  @Input() task?: Task; // Recebe uma tarefa existente para o modo de edição. É opcional.

  @Output() save = new EventEmitter<Task>(); // Emite o objeto da tarefa (novo ou atualizado) quando o formulário é salvo.

  // --- Injeção de Dependências ---
  private fb = inject(FormBuilder);
  private locationService = inject(Location);  // <-- Injeta o serviço Location

  // --- Estado Interno do Componente ---
  taskForm!: FormGroup;
  isEditMode = false;
  showAdvanced = signal(false);

  // Dados para os selects do formulário
  categories = ['Estudos', 'Trabalho', 'Casa'];
  reminders = ['Nenhum', '30m', '1h', '1d', '1w'];
  repetition = ['Nenhuma', 'Diária', 'Semanal', 'Mensal'];

  ngOnInit(): void {
    this.isEditMode = !!this.task; // Define se está em modo de edição
    if (this.isEditMode) {
      this.showAdvanced.set(true); // No modo de edição, sempre mostra campos avançados
    }
    this.initForm();
  }



  formatPriorityLabel(value: number): TaskPriority {
    if (value === 2) return 'Média';
    if (value === 3) return 'Alta';

    return 'Baixa'; // Se não for Média nem Alta, retorna Baixa
  }

  private formatTime(date:Date | undefined | null): string {  // Função para extrair a hora de um objeto Date no formato "HH:mm"
    if (!date) return '';

    return new Date(date).toTimeString().slice(0, 5); // new Date(date) cria uma cópia para não modificar o original
  }

  private initForm(): void {
    // Mapeia a prioridade de texto para número
    const priorityMap: { [key: string]: number } = { 'Baixa': 1, 'Média': 2, 'Alta': 3 };
    const initialPriorityValue = this.task ? priorityMap[this.task.priority] : 1;
    const initialStartTime = this.formatTime(this.task?.startDate || new Date());

    this.taskForm = this.fb.group({
      // O valor inicial de cada campo depende se estamos editando ou criando
      name: [this.task?.name || '', Validators.required],
      category: [this.task?.category || 'Estudos', Validators.required],
      description: [this.task?.description || ''],
      priority: [initialPriorityValue, Validators.required],

      startDate: [this.task?.startDate || new Date(), Validators.required], // A data de início é obrigatória
      endDate: [this.task?.endDate || null],

      startTime: [initialStartTime, Validators.required],
      endTime: [this.formatTime(this.task?.endDate)],

      reminder: [this.task?.reminder || 'Nenhum', Validators.required],
      repetition: [this.task?.repetition || 'Nenhuma', Validators.required],

      keepAdding: [false] // Este campo controla a checkbox "continuar adicionando"
    }, {
      validators: dateRangeValidator() // Adiciona o validador customizado ao grupo de formulários
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

    const startDate = new Date(formValue.startDate);
    const [startHours, startMinutes] = formValue.startTime.split(':').map(Number);
    startDate.setHours(startHours, startMinutes);

    let endDate: Date | null = null;
    if (formValue.endDate) {
      endDate = new Date(formValue.endDate);
      if (formValue.endTime) {
        const [endHours, endMinutes] = formValue.endTime.split(':').map(Number);
        endDate.setHours(endHours, endMinutes);
      } else {
        endDate.setHours(23, 59);
      }
    }

    // Converte o valor numérico do slider de volta para texto antes de salvar
    const priorityText = this.formatPriorityLabel(formValue.priority);


    // Monta o objeto da tarefa para ser emitido
    const taskData: Task = {
      // Se estiver em modo de edição, mantém o ID e status originais
      id: this.task?.id || '', // O ID real será gerado no service
      status: this.task?.status || 'Pendente',
      name: formValue.name,
      category: formValue.category,
      description: formValue.description,
      priority: priorityText,
      reminder: formValue.reminder || 'Nenhum',
      repetition: formValue.repetition || 'Nenhuma',

      startDate: startDate,
      endDate: endDate || undefined, // Se endDate for null, define como undefined para o caso de tarefas sem data de término
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
