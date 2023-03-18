import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'topics',
    loadChildren: () => import('./pages/topics-list/topics-list.module').then( m => m.TopicsListPageModule)
  },
  {
    path: '',
    redirectTo: 'topics',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
