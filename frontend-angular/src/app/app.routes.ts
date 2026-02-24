import { Routes } from '@angular/router';
import { BootListComponent } from './components/boot-list.component';
import { BootDetailComponent } from './components/boot-detail.component';
import { BootFormComponent } from './components/boot-form.component';

export const routes: Routes = [
	{ path: '', component: BootListComponent },
	{ path: 'boots/new', component: BootFormComponent },
	{ path: 'boots/edit/:id', component: BootFormComponent },
	{ path: 'boots/:id', component: BootDetailComponent },
	{ path: '**', redirectTo: '' }
];
