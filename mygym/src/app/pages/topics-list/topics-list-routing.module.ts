import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./topics-list.page').then( m => m.TopicsListPage)
  },
  {
    path: '/:id',
    loadChildren: () => import('../topic-details/topic-details.module').then( m => m.TopicDetailsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicsListPageRoutingModule {}
