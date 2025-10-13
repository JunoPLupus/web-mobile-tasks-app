import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

// Importações do Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-task-button',
  standalone: true,
  imports: [
    RouterLink, // Para navegação
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './add-task-button.component.html',
  styleUrl: './add-task-button.component.scss'
})
export class AddTaskButtonComponent {
  // Nenhuma lógica necessária aqui por enquanto
}
