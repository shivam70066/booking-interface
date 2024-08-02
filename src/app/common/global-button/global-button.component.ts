import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-global-button',
  standalone: true,
  imports: [],
  templateUrl: './global-button.component.html',
  styleUrl: './global-button.component.scss'
})
export class GlobalButtonComponent {
  showPopUp : boolean = false;

  constructor(private router : Router, private commonService : CommonService){}

  toggleInterface(){
    this.commonService.setInterfaceStatus(true);
    this.router.navigate(['hotels-properties'],{
      skipLocationChange: true
    });
  }
}
