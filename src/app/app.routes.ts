import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';

const routeConfig: Routes = [
  {
    path: '',
    component: DashboardComponent,
    title: 'Dashboard',
  },
];

export default routeConfig;
