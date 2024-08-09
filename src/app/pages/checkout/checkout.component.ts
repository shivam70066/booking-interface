import { CommonService } from '../../services/common.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { HotelService } from '../../services/hotel-services.service';
import { Router } from '@angular/router';
import {
  CreditCardValidators,
  CreditCard,
  CreditCardDirectivesModule,
  CardDefinition,
} from 'angular-cc-library';
import { CreditCardFormatDirective } from 'angular-cc-library';
import { clippingParents } from '@popperjs/core';
import { LoaderComponent } from "../../common/loader/loader.component";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    CreditCardDirectivesModule,
    CreditCardFormatDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    LoaderComponent
],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CheckoutComponent implements OnInit {

  public billingDetails: any;
  cartDataSubscription!: Subscription;
  cartData: any;
  cartTotalSubscription!: Subscription;
  cartTotal: any;

  public regex_email: any = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{1,}$/i;

  billingForm: FormGroup = this.fb.group({
    first_name: ["", [Validators.required]],
    last_name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email, Validators.pattern(this.regex_email)]],
    phone: ["", [Validators.required]],
    address: ["", [Validators.required]],
    city: ["", [Validators.required]],
    zipcode: ["", [Validators.required]],
    country: ["", [Validators.required]],
    state: ["", [Validators.required]]
  });
  paymentForm = this.fb.group({
    cc_number: ['', [ < any > CreditCardValidators.validateCCNumber]],
            card_holder: ['', [Validators.required]],
            expiry_date: ['', [Validators.required, < any > CreditCardValidators.validateExpDate]],
            cvv: ['', [ < any > Validators.required, < any > Validators.minLength(3), < any > Validators.maxLength(4)]]
  });


  constructor(private commonService: CommonService,
    private fb: FormBuilder,
    private hotelService: HotelService,
    private router: Router) {
    this.commonService.setPagetitle("Checkout");
  }

  ngOnInit(): void {

    this.cartTotalSubscription = this.commonService.checkcartItemsTotal.subscribe((cartTotal) => {
      this.cartTotal = cartTotal;
      console.log(cartTotal);
    })

    this.cartDataSubscription = this.commonService.checkcartItems.subscribe((cartData) => {
      this.cartData = cartData;
      console.log(cartData);
    })

    if (localStorage.getItem('mupog')) {
      var mupog = localStorage.getItem('mupog');
      this.hotelService.getAllCartData({ mupog: mupog }).subscribe({
        next: (resp: any) => {
          this.billingDetails = resp.data.customer;
          this.billingForm = this.fb.group({
            first_name: [this.billingDetails.first_name, [Validators.required]],
            last_name: [this.billingDetails.last_name, [Validators.required]],
            email: [this.billingDetails.customer_email, [Validators.required, Validators.email, Validators.pattern(this.regex_email)]],
            phone: [this.billingDetails.phone_number, [Validators.required]],
            address: [this.billingDetails.address, [Validators.required]],
            city: [this.billingDetails.city, [Validators.required]],
            zipcode: [this.billingDetails.zip_code, [Validators.required]],
            country: [this.billingDetails.country, [Validators.required]],
            state: [this.billingDetails.state, [Validators.required]]
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

  }

  getData() {
    console.log(this.billingForm.value);

  }


  billingProcess() {
    if (this.billingForm.valid) {
      // this.showEditCheckout.billing = true;
      // this.showEditCheckout.payment = false;
      // if(this.showEditCheckout.traveller)
      //     this.showEditCheckout.traveller[0] = false;
      // this.checkoutSteps++;
      let billingData = {
        'customer': {}
      };
      billingData.customer = {
        first_name: this.billingForm.value.first_name,
        last_name: this.billingForm.value.last_name,
        phone_number: this.billingForm.value.phone,
        city: this.billingForm.value.city,
        address: this.billingForm.value.address,
        zip_code: this.billingForm.value.zipcode,
        customer_email: this.billingForm.value.email,
        country: this.billingForm.value.country,
        state: this.billingForm.value.state,
        // customer_id: this.billingDetails.customer_id
      };
      let data = {
        mupog: localStorage.getItem('mupog'),
        customer: {
          cart_item_id: null,
          customer_id: '',
          customer_email: this.billingForm.value.email,
          first_name: this.billingForm.value.first_name,
          last_name: this.billingForm.value.last_name,
          city: this.billingForm.value.city,
          zip_code: this.billingForm.value.zipcode,
          state: this.billingForm.value.state,
          country: this.billingForm.value.country,
          address: this.billingForm.value.address,
          phone_number: this.billingForm.value.phone,
          secondary_phone_number: null,
          customer_emails: {
            0: null
          }
        },
        travellers: [],
      };

      this.hotelService.saveCartCustomer(data).subscribe((response: any) => {
        if (response.status === 'success') {
          // for(let i=0;i < this.travellerForm.length;i++){
          //     if(!this.sameAsBilling[i] || this.travellerDetails[i].same_as_customer || typeof this.travellerDetails[i].email == 'undefined'){
          //         if (typeof this.travellerDetails[i].email == 'undefined') {
          //             if(!this.isMobile)
          //                 this.sameAsBilling[i] = false;
          //             else
          //                 this.sameAsBilling[i] = true;
          //         }
          //         this.makesameAsBilling(i);
          //       }
          //    }
          console.log(response);


        } else if (response.status === 'error') {
          alert(response.message)
        }
      });
    }
  }

  placeOrder() {

    if (this.paymentForm.valid) {
      // this.showPlaceOrderLoader = true;
      const whitespaceRemovedCardNo = this.paymentForm?.value?.cc_number?.replace(/\s/g, '');
      this.paymentForm.value.cc_number = whitespaceRemovedCardNo;
      let cardType = CreditCard.cardFromNumber(this.paymentForm.value!.cc_number!);
      let mask = this.paymentForm.value?.cc_number?.replace(/[0-9]/g, "*");
      let payment_method: any = {};
      let name = this.paymentForm.value?.card_holder?.split(' ');
      var fname = '';
      var lname = '';
      var mname = '';
      if (name!.length > 1) {
        if (name!.length == 2) {
          fname = name![0];
          lname = name![1];
        } else if (name!.length == 3) {
          fname = name![0];
          mname = name![1]
          lname = name![2];
        }
      } else {
        fname = this.paymentForm.value?.card_holder || "";
      }
      // if(this.gcc.applyGiftCard){
      //     payment_method = {
      //         cc_number_mask: mask,
      //         gcc: this.gcc.code,
      //         applyGiftcard : this.gcc.applyGiftCard,
      //         cc_number: this.paymentForm.value.cc_number,
      //         cc_type: cardType.type,
      //         cc_cid: this.paymentForm.value.cvv,
      //         cc_exp_month: (this.paymentForm.value.expiry_date.split('/')[0]).trim(),
      //         cc_exp_year: ((this.paymentForm.value.expiry_date.split('/')[1]).trim()).substring(0,4),
      //         first_name: fname,
      //         last_name : lname,
      //         middle_name :  mname

      //     };
      // } else {
      payment_method = {
        cc_number_mask: mask,
        cc_number: this.paymentForm.value.cc_number,
        cc_type: cardType.type,
        cc_cid: this.paymentForm.value.cvv,
        cc_exp_month: (this.paymentForm.value!.expiry_date!.split('/')[0]).trim(),
        cc_exp_year: ((this.paymentForm.value!.expiry_date!.split('/')[1]).trim()).substring(0, 4),
        first_name: fname,
        last_name: lname,
        middle_name: mname
      };
      // }

      let data = {
        mupog: localStorage.getItem('mupog'),
        payment_method: payment_method,
        teamcode: false,
        newsLetter: false,
      };
      this.hotelService.createReservation(data).subscribe((response: any) => {
        if (response.status === 'success') {
          let reservationID = response.data.reservation_id;
          let emptyCart = response.data.empty_cart;
          localStorage.removeItem('continueAsGuest');
          localStorage.removeItem('cartTotal');
          localStorage.removeItem('mupog');
          localStorage.removeItem('cartData');
          localStorage.removeItem('billingData');
          localStorage.removeItem('travellers');
          localStorage.removeItem('splitImages');
          localStorage.removeItem('splitUniqueIndex');
          localStorage.removeItem('currentSelectedSplitIndex');
          localStorage.removeItem('onGoingRequest');
          localStorage.removeItem('splitDates');
          this.commonService.updateCartData(0);
          // this.commonService.setReservationSuccessID(reservationID);
          this.router.navigate(['checkout/success']);
        } else {

          // this.openDialog({'message':response.message,'title':"ERROR",'type':'error','for':'reservation_creation'});
          // setTimeout(() => {
          //     this.checkoutScroll.scrollIntoView({
          //         behavior: "smooth"
          //     });
          // }, 200);
        }
        // this.showPlaceOrderLoader = false;
      });
    } else {
      // this.showTCError = true;
    }
  }

  moveCursorToEnd(inputElement: HTMLInputElement): void {
    const length = inputElement.value.length;
    inputElement.setSelectionRange(length, length);
    console.log("here");

  }

  ngOnDestroy(): void {
    this.cartDataSubscription?.unsubscribe();
    this.cartTotalSubscription?.unsubscribe();
  }
}
