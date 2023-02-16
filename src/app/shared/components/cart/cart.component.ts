import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../service/shopping-cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  quantity$ = this.shoppingCartService.quantityAction$;
  total$ = this.shoppingCartService.totalAction$;
  cart$ = this.shoppingCartService.cartAction$;

  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit(): void {
  }

}
