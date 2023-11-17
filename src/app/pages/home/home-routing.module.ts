import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddComponent } from './add/add.component';


const routes: Routes = [
    { 
      path: '', component: HomeComponent
    },
    { path: 'producto/:action', component: AddComponent },
    { path: 'producto/:action/:id', component: AddComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
