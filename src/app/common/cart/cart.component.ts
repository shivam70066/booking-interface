import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AddToCartService, GetPosAvailableService, LoadCartDataService } from '../../../swagger/api/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddToCartResponse, GetPriceModuleSelectedDatesResponse } from '../../../swagger/api/models';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { HotelService } from '../../services/hotel-services.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartComponent implements OnInit {
  showAdditionalLinks: boolean = true;
  cartData: { [key: string]: any[] } = {};
  cartTotal: any = 0;
  additionalProducts: any;
  totalCartItems: any;
  showAdditionalPOSLinks: any;
  forCheckout: any;
  posProducts: any = [];
  showModal: boolean = false;
  roomSelectedForPos: any;
  roomsAllowedForPos: any;
  posItem: any;


  constructor(private loadCartDataService: LoadCartDataService,
    private loadPosDataService: GetPosAvailableService,
    private addToCartService: AddToCartService,
    private commonService: CommonService,
    private router : Router,
    private hotelService : HotelService
  ) {
  }

  ngOnInit(): void {
    this.loadCartData();
    this.commonService.setPagetitle('Cart');
  }

  loadCartData() {
    var mupog = localStorage.getItem('mupog');
    if (mupog) {
      this.loadCartDataService.frontendCartLoadCartDataPost({ body: { 'mupog': mupog } }).subscribe((data: any) => {
        if (data.status === 'success') {
          if (data.data.cart_data != undefined && data.data.cart_data != '' && Object.keys(data.data.cart_data).length > 0) {
            setTimeout(() => {
              this.cartData = data.data.cart_data;
              console.log(this.cartData)
              this.cartTotal = data.data.cart_total;
              this.additionalProducts = data.data.additionalProducts;
              if (this.cartTotal.promotion_applied !== undefined && this.cartTotal.promotion_applied !== '' && this.cartTotal.promotion_applied !== 'undefined' && this.cartTotal.promotion_applied !== null) {
                this.cartTotal.promotion_applied = parseInt(this.cartTotal.promotion_applied);
              } else {
                this.cartTotal.promotion_applied = 0;
              }
              this.totalCartItems = data.data.cart_data[Object.keys(data.data.cart_data)[0]][0].cart_items_count;
              var width = window.innerWidth;
              // this.showCartTooltip = {rateplan: [], rate: []};
              var j = 0;
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
              this.commonService.updateCartData(this.totalCartItems);
              this.commonService.updateCartItems(this.cartData);
              this.commonService.updateCartItemsTotal(this.cartTotal);
              // setTimeout(()=>{
              //   this.setCartItemHeight(cartClass);
              // },0);
            }, 0);
          }
          else {
            this.cartData = {};
            // this.showCartTooltip = {rateplan: [], rate: []};
            this.cartTotal = [];
            this.totalCartItems = 0;
            // this.promotionGiftCard = '';
            // this.promotionStatus = '';
            // this.promotionTxt = '';
            // this.gcc = {
            //         code:'',
            //         applyGiftCard: false
            //       };

            localStorage.removeItem('mupog');
            this.commonService.updateCartData(this.totalCartItems);
            this.commonService.updateCartItems(this.cartData);
            this.commonService.updateCartItemsTotal(this.cartTotal);
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
          this.commonService.updateCartData(this.totalCartItems);
          this.commonService.updateCartItems(this.cartData);
          this.commonService.updateCartItemsTotal(this.cartTotal);
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
        this.loadPosData();
      });
    }
  }

  addToCart(room: any) {
    var reservationItems: any = [];
    Object.keys(this.cartData).forEach((value, index) => {
      if (this.cartData[value][0].cart_type == 'reservation' && (Number(room.allowed_for_all_rooms) == 1 || room.associate_with_rooms.split(',').indexOf('' + this.cartData[value][0].cart_room_type_id) != -1))
        reservationItems.push(this.cartData[value][0]);
    });
    console.log(Object.keys(reservationItems).length > 1);

    if (Object.keys(reservationItems).length > 1) {
      this.roomsAllowedForPos = reservationItems;
      this.posItem = room;
      this.showModal = true;
      // const dialogRef = this.dialog.open(PopupComponent, {
      //   width: '800px',
      //   data: {
      //     'title':'Select Room',
      //     'message':'Please select the room for which you want to add POS  ('+room.product_name+').',
      //     'cartItems': reservationItems
      //   },
      //   panelClass: 'mlspopblock'
      // });

      // dialogRef.afterClosed().subscribe(item_cart_id => {
      //   if(typeof item_cart_id != 'undefined' && item_cart_id)
      //     this.addToCartfn(room, item_cart_id);
      // });
    } else if (Object.keys(reservationItems).length == 1 && (Number(room.allowed_for_all_rooms) == 1 || room.associate_with_rooms.split(',').indexOf('' + reservationItems[0].cart_room_type_id) != -1))
      this.addToCartfn(room, reservationItems[0].cart_item_id);
    else
      this.addToCartfn(room, 0);
  }

  addToCartfn(room: any, cart_item_id: number) {
    console.log(room, cart_item_id)
    var mupog = localStorage.getItem('mupog');
    // this.showLoader = true;
    var selectedPolicy = 2;
    var reservationInfo: any = {};
    if (cart_item_id)
      reservationInfo.room_cart_item_id = cart_item_id;
    else
      reservationInfo.room_cart_item_id = 0;
    reservationInfo.cart_type = 'pos';
    reservationInfo.roomTypeName = room.product_name;
    reservationInfo.amount = reservationInfo.nightlySum = room.product_price;
    reservationInfo.service_quantity = 1;
    reservationInfo.tax_value = room.tax_value;
    reservationInfo.tax_id = room.product_tax;
    reservationInfo.tax_name = room.tax_name;
    reservationInfo.selectedPolicyId = selectedPolicy;
    if (room.hasOwnProperty('totalDiscount') && room.totalDiscount[selectedPolicy] > 0) {
      reservationInfo.product_discount = '';
      reservationInfo.promo = '';
      reservationInfo.promotion_id = '';
    } else {
      reservationInfo.product_discount = 0;
    }
    reservationInfo.productId = room.product_id;
    if (mupog != undefined && mupog != '') {
      reservationInfo.mupog = mupog;
    }
    console.log(room);
    console.log(reservationInfo)
    this.addToCartService.frontendCartAddToCartPost({ body: reservationInfo }).subscribe((data: any) => {
      if (data.status == 'error') {
        console.log(data.message);
        // this.openDialog({'message':data.message,'title':data.status.toUpperCase(), 'confirm' : false});
        // this.showLoader =false;
      } else {
        this.loadCartData();
      }
    });

  }

  /* Function to calculate subtotal on basis of discount*/
  getProductSubtotal(subtotal: string, discount: string) {
    if (parseFloat(discount) > 0) {
      return (parseFloat(subtotal) - parseFloat(discount)).toFixed(2);
    }
    return subtotal;
  }

  /* Function to check discount is applied or not*/
  checkDiscountApplied(discount: string) {
    if (parseFloat(discount) > 0) return true;
    return false;
  }

  getGrandTax(taxes: any) {
    var tax = 0.00;
    taxes.forEach((val: any, key: any) => {
      tax += parseFloat(val.tax_amount);
    });
    return '$' + tax.toFixed(2);
  }


  loadPosData() {
    this.loadPosDataService.frontendSearchresultsGetPosAvailableOnFeGet().subscribe({
      next: (response) => {
        this.changePOSData(response.data);
        console.log(this.posProducts)
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  changePOSData(posData: any) {
    var cartDataForPos: any = [];
    Object.keys(this.cartData).forEach((val, key) => {
      cartDataForPos.push(this.cartData[val][0]);
    })
    this.posProducts = posData.filter((item: any) => {
      if (item.allowed_for_all_rooms == "1")
        return true;
      var ret = false;
      for (let i = 0; i < cartDataForPos.length; i++) {
        if (item.associate_with_rooms.split(",").indexOf(cartDataForPos[i].cart_room_type_id) != -1) {
          ret = true;
          break;
        }
      }
      return ret;
    });

  }

  addPos() {
    this.addToCartfn(this.posItem, this.roomSelectedForPos.cart_item_id);
    this.posItem = null;
    this.roomSelectedForPos = null;
  }

  emptyCart(){
    var mupog = localStorage.getItem('mupog') || '';
    var cartData:{mupog:string,cartItemIds:Array<string>} = {mupog:mupog,cartItemIds:[]};
    // this.showLoader = true;
    var cartKeys = Object.keys(this.cartData);
    cartKeys.forEach((item,index) => {
      this.cartData[item].forEach((val:any)=>{
        cartData.cartItemIds.push(val.cart_item_id);
      })
    });
    this.deleteMultipleCartItems(cartData,'cancel');
  }

  deleteMultipleCartItems(cartData:any, type:any){
    this.hotelService.deleteCart(cartData).subscribe((data:any) => {
      if(data.status === 'success'){
        localStorage.removeItem('splitImages');
        localStorage.removeItem('splitUniqueIndex');
        localStorage.removeItem('currentSelectedSplitIndex');
        localStorage.removeItem('onGoingRequest');
        localStorage.removeItem('splitDates');
        setTimeout(()=>{
          if(data.data.length === 0){
            setTimeout(()=>{
              this.cartTotal = [];
              this.totalCartItems = 0;
              // this.promotionGiftCard = '';
              // this.promotionStatus = '';
              // this.promotionTxt = '';
              // this.gcc = {
              //         code:'',
              //         applyGiftCard: false
              //       };
              localStorage.removeItem('mupog');

              this.commonService.updateCartData(this.totalCartItems);
              this.commonService.updateCartItems([]);
              this.commonService.updateCartItemsTotal(this.cartTotal);
              this.router.navigate(['hotels-properties'],{
                skipLocationChange: true
              });
            },100);
          } else {
            // this.loadCartData(this.cartClass);
          }

          // this.showLoader = false;
        },500);
      } else {
          // this.showLoader = false;
          // this.openDialog({'message':data.message,'title':data.status.toUpperCase()});
      }
      // this.updateIcons();
      // this.showLoader = false;
    });
  }

  deleteCartItem(cartItemId:any,mupog:any){
    // this.showLoader =true;
    this.hotelService.deleteCartItem({'cart_item_id':cartItemId,'mupog':mupog}).subscribe((data:any) => {
      if(data.status === 'success'){
          if(data.data.cart_data != undefined && data.data.cart_data != '' ){
              if(Object.keys(data.data.cart_data).length>0){
                setTimeout(()=>{
                  this.loadCartData();
                },100);
              } else{
                setTimeout(()=>{
                  // this.cartData = [];
                  this.cartTotal = [];
                  this.totalCartItems = 0;
                  // this.promotionGiftCard = '';
                  // this.promotionStatus = '';
                  // this.promotionTxt = '';
                  // this.gcc = {
                  //         code:'',
                  //         applyGiftCard: false
                  //       };
                  localStorage.removeItem('mupog');
                  this.commonService.updateCartData(this.totalCartItems);
                  this.commonService.updateCartItems([]);
                  this.commonService.updateCartItemsTotal(this.cartTotal);
                  if(this.router.url == '/checkout' || this.router.url == '/cart'){
                      this.router.navigate(['']);
                  }
                },100);
              }

          } else{
            setTimeout(()=>{
              // this.cartData = [];
              this.cartTotal = [];
              this.totalCartItems = 0;
              // this.promotionGiftCard = '';
              // this.promotionStatus = '';
              // this.promotionTxt = '';
              // this.gcc = {
              //         code:'',
              //         applyGiftCard: false
              //       };
              localStorage.removeItem('mupog');
              this.commonService.updateCartData(this.totalCartItems);
              this.commonService.updateCartItems([]);
              this.commonService.updateCartItemsTotal(this.cartTotal);
              if(this.router.url == '/checkout' || this.router.url == '/cart'){
                this.router.navigate(['hotels-properties']);
              }
            },100);
          }
          // this.commonService.updateCartStatus({'status':'single'+this.totalCartItems});
          // this.showLoader = false;

      } else {
          // this.showLoader = false;
          // this.openDialog({'message':data.message,'title':data.status.toUpperCase()});
      }
      // this.updateIcons();
      if(this.totalCartItems==0){
        this.router.navigate(['hotels-properties']);
      }
    });
  }
}
