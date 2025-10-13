import { Routes } from '@angular/router';
/*import { ProfileSettingsComponent } from './features/profile/profileSettings.component';
import { ReportDashboardComponent } from './features/reports/reportDashboard.component';*/

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks', // Carrega o componente da lista de tarefas
    loadComponent: () =>
      import('./features/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  {
    path: 'tasks/new', // Carrega o componente de página para adicionar tarefa
    loadComponent: () =>
      import('./features/tasks/task-add/task-add.component').then(m => m.TaskAddComponent)
  },
  {
    path: 'tasks/detail/:id',
    loadComponent: () =>
      import('./features/tasks/task-detail/task-detail.component').then(m => m.TaskDetailComponent)
  },
  {
    path: 'tasks/edit/:id', // <-- Nossa nova rota com um parâmetro dinâmico ':id'
    loadComponent: () =>
      import('./features/tasks/task-edit/task-edit.component').then(m => m.TaskEditComponent)
  }
  /*
  { path: 'profile', component: ProfileSettingsComponent },
  { path: 'reports', component: ReportDashboardComponent },*/
];
