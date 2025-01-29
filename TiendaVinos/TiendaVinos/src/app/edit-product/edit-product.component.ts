
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  producto: any = {};

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.producto = {
        nombre: params['nombre'],
        cantidad: params['cantidad'],
        precio: params['precio'],
        fechaIngreso: params['fechaIngreso'],
        descripcion: params['descripcion'],
        imagen: params['imagen']
      };
    });
  }

  onCancel() {
    this.router.navigate(['/']);
  }

}
