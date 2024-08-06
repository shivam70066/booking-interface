import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { LoadCartDataService } from '../../../swagger/api/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartComponent implements OnInit {
  showAdditionalLinks: boolean = true;
  cartData: {[key: string]: any[]} = {};
  cartTotal: any = 0;
  additionalProducts: any;
  totalCartItems:any;
  showAdditionalPOSLinks: any;
  forCheckout: any;
posProducts: any;

  constructor(private loadCartDataService : LoadCartDataService){
  }

  ngOnInit(): void {
    this.loadCartData();
  }

  loadCartData(){
    var mupog = localStorage.getItem('mupog');
    if(mupog ){
      this.loadCartDataService.frontendCartLoadCartDataPost({body:{'mupog':mupog}}).subscribe((data:any) => {
          if(data.status === 'success'){
              if(data.data.cart_data != undefined && data.data.cart_data != '' && Object.keys(data.data.cart_data).length>0){
                setTimeout(()=>{
                  this.cartData = data.data.cart_data;
                  console.log(this.cartData)
                  this.cartTotal = data.data.cart_total;
                  this.additionalProducts = data.data.additionalProducts;
                  // if(this.cartTotal.promotion_applied !== undefined && this.cartTotal.promotion_applied !== '' && this.cartTotal.promotion_applied !== 'undefined' &&  this.cartTotal.promotion_applied !== null){
                  //   this.cartTotal.promotion_applied = parseInt(this.cartTotal.promotion_applied);
                  // } else {
                  //     this.cartTotal.promotion_applied = 0;
                  // }
                  this.totalCartItems = data.data.cart_data[Object.keys(data.data.cart_data)[0]][0].cart_items_count;
                  var width = window.innerWidth;
                  // this.showCartTooltip = {rateplan: [], rate: []};
                  var j = 0 ;
                  var i = '';
                  // while(j < Object.keys(data.data.cart_data).length){
                  //   i = Object.keys(data.data.cart_data)[j];
                  //   this.showCartItem[i] = [];
                  //   for (var k = 0 ; k <= data.data.cart_data[i].length - 1; k++) {
                  //     if (this.cartData[i][k].rate_plan_description) {
                  //       this.showCartTooltip['rateplan'][this.cartData[i][k].product_id] = false;
                  //       this.showCartTooltip['rate'][this.cartData[i][k].product_id] = false;
                  //     }
                  //     this.showCartItem[i][k]= true;
                  //   }
                  //   j++;
                  // }
                  // this.showCartItems = true;
                  // this.updateIcons();
                  // this.commonService.updateCartData(this.totalCartItems);
                  // this.commonService.updateCartItems(this.cartData);
                  // this.commonService.updateCartItemsTotal(this.cartTotal);
                  // setTimeout(()=>{
                  //   this.setCartItemHeight(cartClass);
                  // },0);
                },0);
              }
               else{
                // this.cartData = [];
                // this.showCartTooltip = {rateplan: [], rate: []};
                // this.cartTotal = [];
                // this.totalCartItems = 0;
                // this.promotionGiftCard = '';
                // this.promotionStatus = '';
                // this.promotionTxt = '';
                // this.gcc = {
                //         code:'',
                //         applyGiftCard: false
                //       };

                localStorage.removeItem('mupog');
                // this.commonService.updateCartData(this.totalCartItems);
                // this.commonService.updateCartItems(this.cartData);
                // this.commonService.updateCartItemsTotal(this.cartTotal);
              }
          } else {
            // this.cartData = [];
            // this.showCartTooltip = {rateplan: [], rate: []};
            // this.cartTotal = [];
            // this.totalCartItems = 0;
            // this.promotionGiftCard = '';
            // this.promotionStatus = '';
            // this.promotionTxt = '';
            // this.gcc = {
            //         code:'',
            //         applyGiftCard: false
            //       };
            localStorage.removeItem('mupog');
            // this.commonService.updateCartData(this.totalCartItems);
            // this.commonService.updateCartItems(this.cartData);
            // this.commonService.updateCartItemsTotal(this.cartTotal);
            // this.showLoader = false;
          }
          // if (this.isMobile) {
          //   var element = document.getElementById('mycart');
          // } else {
          //   var element = document.getElementById('reservationdeatils');
          // }
          // window.scrollTo(0,0);
          // this.showMobileSpinner =false;
          // this.onGoingCartRequest =false;
          // this.loadPosData();
        });
    }
  }

  /* Function to calculate subtotal on basis of discount*/
  getProductSubtotal(subtotal:string,discount:string) {
    if(parseFloat(discount)>0) {
      return (parseFloat(subtotal)-parseFloat(discount)).toFixed(2);
    }
    return subtotal;
  }

  /* Function to check discount is applied or not*/
  checkDiscountApplied(discount:string) {
    if (parseFloat(discount)> 0) return true;
    return false;
  }

  getGrandTax(taxes:any){
    console.log(taxes)
    var tax = 0.00;
    taxes.forEach((val:any,key:any)=>{
      tax += parseFloat(val.tax_amount) ;
    });
    return '$'+tax.toFixed(2);
  }

}
