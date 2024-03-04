import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductosService } from 'src/app/service/productos.service';

import { Product } from './interface/product.interface';
import { DropdownEvent } from './interface/dropdownEvent.interface';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css'],
})
export class ListaProductosComponent implements OnInit, OnDestroy {
  public inputSearch: FormGroup;
  public searchesTable = { id: '', forms: '' };
  private searchTerm$ = new Subject<string>();
  public openModals = false;
  public body: Product[] = [];
  public header = [
    { th: 'id' },
    { th: 'nombre' },
    { th: 'descripción' },
    { th: 'logo' },
    { th: 'fecha lanzamiento' },
    { th: 'revisión de fecha' },
    { th: 'acción' },
  ];
  public dropdowns: DropdownEvent;
  private destroy$ = new Subject<void>();

  constructor(
    private productosService: ProductosService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.initializeForm();
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchTerm$.complete();
  }

  private getProducts(): void {
    this.productosService.getProducts().subscribe((products: Product[]) => {
      this.body = products.map((product) => ({
        ...product,
        date_release: this.convertDate(product.date_release),
        date_revision: this.convertDate(product.date_revision),
      }));
    });
  }

  private initializeForm(): void {
    this.inputSearch = this.fb.group({
      inputSearch: ['', [Validators.minLength(3)]],
    });
  }

  private setupSearchSubscription(): void {
    this.inputSearch
      .get('inputSearch')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((term: string) => {
        this.searchesTable = {
          id: term,
          forms: this.inputSearch.value,
        };
      });
  }

  public onSearchChange(term: string): void {
    this.searchTerm$.next(term);
  }

  public addButton(): void {
    console.log('addButton');
  }

  public dropdown(event: any): void {
    this.dropdowns = event;
    switch (event.event) {
      case 'edit':
        const navigationExtras: NavigationExtras = { state: { datos: event } };
        this.router.navigate(['/formulario-producto/editar'], navigationExtras);
        break;
      case 'deleted':
        this.openModals = true;
        break;
      default:
        console.log('Acción no reconocida', event.event);
    }
  }

  private convertDate(dateStr: string): string {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month.toString().padStart(2, '0')}/${day
      .toString()
      .padStart(2, '0')}/${year}`;
  }

  public modal(id: any): void {
    this.body = this.body.filter((product) => product.id !== id);
    this.productosService.deleteProduct(id).subscribe({
      next: (v) => console.log(v),
      error: (error) => console.error(error),
    });
  }

  public buttonAccepts(event): void {
    this.openModals = false;
    if (event) {
      this.modal(this.dropdowns.data.id);
    }
  }
}
