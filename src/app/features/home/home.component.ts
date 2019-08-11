import { Component, OnInit } from '@angular/core';
import { FeatureComponent } from '@shared/feature.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends FeatureComponent implements OnInit {

}
