import { Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { PointDetailsComponent } from './components/point-details/point-details.component';

export const routes: Routes = [
    { path: '', component: MapComponent },
    { path: 'point-details', component: PointDetailsComponent }
];
