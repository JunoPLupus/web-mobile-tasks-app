import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

// Importações do Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    // Módulos do Angular para Roteamento
    RouterLink,
    RouterLinkActive,

    // Módulos do Material
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  // Nenhuma lógica de TypeScript é necessária aqui.
  // A navegação e o estado ativo são controlados declarativamente no template.
}
