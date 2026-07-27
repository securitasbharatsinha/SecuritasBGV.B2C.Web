import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BlogComponent } from './blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

const routes: Routes = [
  { path: '', component: BlogComponent },
  { path: 'detail', component: BlogDetailComponent },
];

@NgModule({
  declarations: [BlogComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BlogModule {}
