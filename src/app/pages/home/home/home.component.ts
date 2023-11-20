import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionsEnum } from 'src/app/models/add.actions';
import { AuthorService } from 'src/app/services/author.service';
import { FinancialProductsService } from 'src/app/services/financial-products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  itemsPerPageNumber: number = 5;
  actualPage = 1;
  products: any[] = [];
  searchText: string = '';

  constructor(
    private _authorService: AuthorService,
    private _router: Router,
    private _financialProductsService: FinancialProductsService,
  ) {}

  ngOnInit(): void {
    this._authorService.generateAuthorId();
    this._financialProductsService.getProducts().subscribe((r) => {
      if (r.length == 0) alert('debes crear productos primero');
      this.products = r;
      this._financialProductsService.productsS = r;
    });
  }

  actionChange(e: any, id: string) {
    if (e.target.value == '-') {
      return;
    }

    if (e.target.value == ActionsEnum.EDIT) {
      this._router.navigate(['/home/producto', 'editar', id]);
      return;
    }

    if (e.target.value == ActionsEnum.DELETE) {
      let result = window.confirm(
        '¿Estás seguro de querer eliminar el producto?',
      );

      if (result) {
        this._financialProductsService.deleteProduct(id).subscribe((r) => {
          alert('producto borrado con exito');
          let index = this.products.findIndex((p) => p.id == id);
          this.products.splice(index, 1);
        });
      }
      return;
    }
  }

  lastPage(): number {
    const cociente = this.products.length / this.itemsPerPageNumber;
    const ultimaPagina = cociente | 0;
    return cociente % 1 === 0 ? ultimaPagina : ultimaPagina + 1;
  }

  search() {
    this.products = this._financialProductsService.productsS.filter((p) => {
      return p.name.toLowerCase().startsWith(this.searchText.toLowerCase());
    });
  }
}
