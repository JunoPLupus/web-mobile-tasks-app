import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'relativeDate',
  standalone: true, // Torna o pipe utilizável em componentes standalone
})

export class RelativeDatePipe implements PipeTransform {

  // Usamos o DatePipe padrão do Angular para nos ajudar na formatação
  constructor(private datePipe: DatePipe) {}

  transform(value: Date | string | undefined | null): string {
    if (!value) {
      return ''; // Retorna vazio se a data for nula ou indefinida
    }

    const date = new Date(value);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);


    const timeString = this.datePipe.transform(date, 'HH:mm'); // Formata a hora no formato "HH:mm"

    // Compara as datas ignorando a hora
    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${timeString}`;
    }

    if (date.toDateString() === tomorrow.toDateString()) {
      return `Amanhã às ${timeString}`;
    }

    // Se não for hoje nem amanhã, retorna a data completa formatada
    return this.datePipe.transform(date, 'dd/MM \'às\' HH:mm') || '';
  }
}
