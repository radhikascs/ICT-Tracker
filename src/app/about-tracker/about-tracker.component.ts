import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-tracker',
  templateUrl: './about-tracker.component.html',
  styleUrls: ['./about-tracker.component.css']
})
export class AboutTrackerComponent implements OnInit {

 genOfRegGraph;
  constructor() { 
    this.genOfRegGraph = "./assets/images/gen-of-reg.png";
  }

  ngOnInit() {
  }

}
