import { Routes } from '@angular/router';
import { MainComponent } from './core/components/main/main.component';
import { LoginComponent } from './core/components/login/login.component';
import { HomeComponent } from './core/components/home/home.component';
import { ListInvestmentsComponent } from './investments/components/list-investments/list-investments.component';
import { ListGoalsComponent } from './goals/components/list-goals/list-goals.component';
import { ListAccountsComponent } from './accounts/components/list-accounts/list-accounts.component';
import { ListAutomationComponent } from './automation/components/list-automation/list-automation.component';
import { ListTransactionsComponent } from './transactions/components/list-transactions/list-transactions.component';
import { ListBudgetsComponent } from './budgets/components/list-budgets/list-budgets.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent},
      { path: 'investments', component: ListInvestmentsComponent },
      { path: 'goals', component: ListGoalsComponent },
      { path: 'accounts', component: ListAccountsComponent },
      { path: 'automation', component: ListAutomationComponent },
      { path: 'transactions', component: ListTransactionsComponent },
      { path: 'budgets', component: ListBudgetsComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
