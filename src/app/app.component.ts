import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  ictLogoURL: string;
  ictLogoText: string;
  ictYear:string;
  activeTabTitle;

  constructor() {
      this.ictLogoURL = "./assets/images/ICT-Logo.jpg";
      this.ictLogoText = "ICT Regulatory Tracker"; 
      this.ictYear="2016";
  }

  onTabChange(name:any) {
    this.activeTabTitle = name;
  }

  ngOnInit() {
   
  }
 
}
