import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicsListPage } from './topics-list.page';

const routes: Routes = [
  {
    path: '',
    component: TopicsListPage
  },
  {
    path: ':id',
    loadChildren: () => import('../topic-details/topic-details.module').then( m => m.TopicDetailsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicsListPageRoutingModule {}
