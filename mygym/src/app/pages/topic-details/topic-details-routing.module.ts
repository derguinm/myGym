import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopicDetailsPage } from './topic-details.page';

const routes: Routes = [
  {
    path: '',
    component: TopicDetailsPage
  },

  /*
  * Quand on ajoutera la page de detail des posts :
  {
    path: '/posts/:id',
    loadChildren: () => import(page de liste des posts).then( m => m.)
  },
  */

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopicDetailsPageRoutingModule {}
