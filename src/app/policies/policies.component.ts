import { Component, OnInit } from '@angular/core';
import { PoliciesService } from '../policies.service';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss'],
})
export class PoliciesComponent implements OnInit {
  policies: any[] = [];
  isLoading: boolean = true;
  keys: any = {};

  constructor(private policiesService: PoliciesService) {
    this.policiesService.init();
    this.policiesService.getPoliciesStateListener().subscribe((policies) => {
      this.policies = policies;
      this.isLoading = false;
      this.keys = Object.keys(this.policies[0]);
    });
  }

  ngOnInit(): void {}
}
