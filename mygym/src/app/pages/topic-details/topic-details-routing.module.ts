import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicDetailsPage } from './topic-details.page';

const routes: Routes = [
  {
    path: '',
    component: TopicDetailsPage
  },

  {
    path: 'posts/:postId',
    loadChildren: () => import("../post-details/post-details.module").then( m => m.PostDetailsPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicDetailsPageRoutingModule {}
