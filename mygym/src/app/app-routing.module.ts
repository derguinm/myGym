import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// const routes: Routes = [
//   {
//     path: 'home',
//     loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
//   },
//   {
//     path: 'message/:id',
//     loadChildren: () => import('./view-message/view-message.module').then( m => m.ViewMessagePageModule)
//   },
//   {
//     path: '',
//     redirectTo: 'home',
//     pathMatch: 'full'
//   },
// ];
export const routes: Routes = [
  {
    path: 'topics',
    loadChildren: () => import('./pages/topics-list/topics-list.module').then( m => m.TopicsListPageModule)
    // loadComponent: () => import('./pages/topics-list/topics-list.page').then( m => m.TopicsListPage)
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
