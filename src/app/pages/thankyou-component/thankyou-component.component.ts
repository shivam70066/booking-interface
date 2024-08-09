import { Component } from '@angular/core';
import { LoaderComponent } from "../../common/loader/loader.component";
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { HotelService } from '../../services/hotel-services.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thankyou-component',
  standalone: true,
  imports: [LoaderComponent,CommonModule],
  templateUrl: './thankyou-component.component.html',
  styleUrl: './thankyou-component.component.scss'
})
export class ThankyouComponentComponent {

  public reserId:string = '';
	public reservationDetail:any = [];
	public commonDetail:any = {amount:{}, biling: {}, payment: {}};
	public show:boolean = false ;
	public showLoader:boolean = true;
	public subscription:any;
	constructor(
    	private router: Router,
		private hotelService: HotelService,
		private commonService:CommonService,
	) {
    this.commonService.setPagetitle("Thank You");
		this.subscription = this.commonService.reservationID.subscribe((response:any) => {
			this.reserId = response;
			if(this.reserId) {
				let data = {
					id : this.reserId
				};
				this.hotelService.getReservationInfo(data).subscribe((response:any) => {
					if(response.status === 'success') {
						var items: any = [];
						var price = 0;
		    			var total_amount = 0;
						this.show = false;
						if(response && response.hasOwnProperty('data') && response.data.hasOwnProperty('reservationsInfo') && response.data.reservationsInfo.hasOwnProperty('itinerary_number')){
							this.reservationDetail[0] = response.data.reservationsInfo;
						}else
							this.reservationDetail = response.data.reservationsInfo;

						total_amount = parseFloat(this.reservationDetail[0].subtotal);
		                if(this.reservationDetail[0].tax_amount != undefined) {
		                    total_amount = total_amount + parseFloat(this.reservationDetail[0].tax_amount);
		                }
		                if(this.reservationDetail[0].discount_amount != undefined) {
		                    total_amount = total_amount - parseFloat(this.reservationDetail[0].discount_amount);
		                }

						this.reservationDetail.forEach((value:any, index:any) => {
							this.reservationDetail
							if(index == 0){
								this.commonDetail.billing = {
									name: value.user_name,
									email: value.user_email,
									phone: value.user_phone,
									address: value.user_address
								};
								if(value.user_city)
									this.commonDetail.billing.address += ', '+value.user_city;
								if(value.user_state)
									this.commonDetail.billing.address += ', '+value.user_state;
								if(value.user_zip_code)
									this.commonDetail.billing.address += ', '+value.user_zip_code;


								this.commonDetail.amount = {
									subtotal : value.subtotal,
									tax_amount_a : value.tax_amount_a,
									grand_total : value.grand_total,
									paid_amount : value.paid_amount,
									remaining_amount : value.remaining_amount
								};
							}else{
								this.commonDetail.amount.subtotal = Number(this.commonDetail.amount.subtotal) + Number(value.subtotal);
								this.commonDetail.amount.grand_total = Number(this.commonDetail.amount.grand_total) + Number(value.grand_total);
								this.commonDetail.amount.paid_amount = Number(this.commonDetail.amount.paid_amount) + Number(value.paid_amount);
								this.commonDetail.amount.remaining_amount = Number(this.commonDetail.amount.remaining_amount) + Number(value.remaining_amount);

								var taxes = value.tax_amount_a;
								for (var key in taxes){
									if(this.commonDetail.amount.tax_amount_a[key])
										this.commonDetail.amount.tax_amount_a[key] = Number(this.commonDetail.amount.tax_amount_a[key]) + Number(taxes[key]);
									else
										this.commonDetail.amount.tax_amount_a[key] = Number(taxes[key]);
								}
							}

							value.reservations.forEach((rvalue:any,rkey:any)=>{
								rvalue.reservation.forEach((singleVal:any,singleKey:any)=>{
									price = parseFloat(singleVal.subtotal);
			                        if(singleVal.additional_guest_amounts != undefined) {
			                            price = price + parseFloat(singleVal.additional_guest_amounts);
			                        }
			                        if(singleVal.discount_amount != undefined) {
			                            price = price - parseFloat(singleVal.discount_amount);
			                        }
			                        var item = {
			                            "id": singleVal.confirmation_number,
			                            "name": singleVal.product_name,
			                            "quantity": 1,
			                            "price": price
			                        };
			                        items.push(item);
			                        if(singleKey == ((rvalue.reservation).length - 1)) {
			                        	// this.sendReservationData(total_amount,items);
			                        }
								});
							});

						});




						this.commonDetail.payment = response.data.reservationPaymentInfo;
						this.show = true;
					}

					this.showLoader = false;
				});
				// this.responsiveService.getMobileStatus().subscribe( isMobile =>{
			  //     	if(typeof isMobile !== 'object' && isMobile !== undefined && isMobile !== null && isMobile !==''){
			  //       	this.isMobile=isMobile;
			  //       	if (this.isMobile) {
			  //          		this.commonService.updatePageTitle('THANK YOU');
			  //       	}
			  //     	}
			  //   });

			} else {
				this.router.navigate(['hotels-properties'],{
          skipLocationChange:true
        }
        );
			}
		});
	}



	ngOnInit() {
		window.scrollTo(0, 0);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		this.commonService.setReservationSuccessID(false);
	}

	/*
	* Print Invoice
	*/
	printInvoice() {
		let data = {id:this.reserId, showPayment: true};
		this.hotelService.printOrder(data).subscribe((response:any) => {
  			if(response.status === 'success') {
          let order:any = response.data;
          let myWindow = window.open();
          if(myWindow) {
    					let print_invoice_data = '';
    					print_invoice_data = order;
              myWindow.document.write(order);
              myWindow.document.close();
              myWindow.focus();
          }
        }
    });
	}

}
