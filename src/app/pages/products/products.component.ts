import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';
import { tap } from 'rxjs';
import { Product } from './product/product.interface';
import { ShoppingCartService } from 'src/app/shared/service/shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

  products!:Product[];

  constructor(private productSvc: ProductsService, private shoppingCartService : ShoppingCartService) {}

  ngOnInit(): void {
    this.productSvc.getProducts()
    .pipe(
      tap((products: Product[]) => this.products = products)
    )
    .subscribe();
  }

  addToCart(product:Product) : void{
    this.shoppingCartService.updateCart(product);
  }
}
