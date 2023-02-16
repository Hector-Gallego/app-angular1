import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { delay, switchMap, tap } from 'rxjs';
import { Details, Order } from 'src/app/shared/interface/order.interface';
import { Store } from 'src/app/shared/interface/store.interface';
import { DataService } from 'src/app/shared/service/data.service';
import { Product } from '../products/product/product.interface';
import { ShoppingCartService } from 'src/app/shared/service/shopping-cart.service';
import { Router } from '@angular/router';
import { ProductsService } from '../products/services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  model = {
    name: '',
    store: '',
    shippingAdress: '',
    city: '',
  };

  cart: Product[] = [];
  stores: Store[] = [];
  isDelivery: boolean = true;

  constructor(
    private dataService: DataService,
    private shoppingCartService: ShoppingCartService,
    private router: Router,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.getStores();
    this.getDataCart();
    this.prepareDetails();
  }

  private getStores(): void {
    this.dataService
      .getStores()
      .pipe(tap((stores: Store[]) => (this.stores = stores)))
      .subscribe();
  }

  onPickupOrDelivery(value: boolean): void {
    this.isDelivery = value;
  }

  onSubmit({ value: formData }: NgForm): void {
    console.log('guardar', formData);
    const data: Order = {
      ...formData,
      date: this.getCurrentDate,
      isDelivery: this.isDelivery,
    };

    this.dataService
      .saveOrder(data)
      .pipe(
        switchMap(({ id: orderId }) => {
          const details = this.prepareDetails();
          return this.dataService.saveDetailsOrders({ details, orderId });
        }),
        tap(() => this.router.navigate(['/checkout/thank-you-page'])),
        delay(2000),
        tap(() => this.shoppingCartService.resetCart())
      )
      .subscribe();
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }

  private prepareDetails(): Details[] {
    const details: Details[] = [];

    this.cart.forEach((product: Product) => {
      const { id: productId, name: productName, quantity, stock } = product;
      const updateStock = stock - quantity;

      this.productsService
        .updateStock(productId, updateStock)
        .pipe(
          tap(() => details.push({ productId, productName, quantity }))
        )
        .subscribe();


    });

    console.log('details -->', details);
    return details;
  }

  private getDataCart(): void {
    this.shoppingCartService.cartAction$
      .pipe(
        tap((products: Product[]) => {
          this.cart = products;
          console.log(this.cart);
        })
      )
      .subscribe();
  }
}
