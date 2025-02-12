import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../cart.service';



@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  productos: any[] = [];  // Array para almacenar los productos
  filtroActivo: string | number = 'all';  // Filtro inicial
  usuarioId: number = 1;  // Asegúrate de obtener esto del estado de la sesión

  constructor(private http: HttpClient, private cartService: CartService) { }

  ngOnInit(): void {
    this.obtenerProductos();  // Cargar productos al iniciar el componente
  }

  // Obtener productos desde la API
  obtenerProductos(): void {
    const apiUrl = 'http://localhost:3000/api/productos';

    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this.productos = response.productos;
          console.log('Productos cargados:', this.productos);
        } else {
          console.error('No se pudieron obtener los productos');
        }
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
      }
    });
  }
  

  // Método para cambiar el filtro activo
  filtrarVinos(tipo: string | number) {
    this.filtroActivo = tipo;
  }

  // Mostrar productos según el filtro activo
  mostrarVino(producto: any): boolean {
    return this.filtroActivo === 'all' || producto.ID_Categoria === this.filtroActivo;
  }

  actualizarProducto(productoId: number, cantidad: number) {
    // Verificar que productoId y cantidad no sean undefined
    if (!productoId || !cantidad) {
      console.error('Producto ID o cantidad no válidos.');
      return;
    }
  
    this.http.put(`http://localhost:3000/api/productos/${productoId}`, { cantidad })
      .subscribe(
        (response) => {
          console.log('Producto actualizado', response);
        },
        (error) => {
          console.error('Error al actualizar el producto', error);
        }
      );
  }

  agregarAlCarrito(producto: any): void {
    if (!producto.ID_Producto) {  // Usamos ID_Producto en lugar de id
      console.error('Producto no tiene un ID');
      alert('Este producto no tiene un ID válido');
      return;
    }
  
    console.log('Producto ID:', producto.ID_Producto);  // Verifica que esté bien el id
  
    if (producto.Stock > 0) {
      // Ahora usaremos producto.ID_Producto en lugar de producto.id
      this.http.put(`http://localhost:3000/api/productos/${producto.ID_Producto}`, { stock: producto.Stock - 1 }).subscribe({
        next: (response) => {
          this.cartService.agregarAlCarrito(producto);
          producto.Stock -= 1;
        },
        error: (err) => {
          console.error('Error al actualizar el stock', err);
          alert('No se pudo reducir el stock.');
        }
      });
    } else {
      alert('No hay stock suficiente para agregar este producto.');
    }
  }
  
  
}
