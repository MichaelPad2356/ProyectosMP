import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';  // Importa HttpClient para hacer peticiones HTTP

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private carrito = new BehaviorSubject<any[]>([]); // Almacena el carrito en el BehaviorSubject
  carrito$ = this.carrito.asObservable();
  private apiUrl = 'http://localhost:3000/api/carrito';  // URL del servidor

  constructor(private http: HttpClient) {}

  // Obtiene el usuarioId desde el localStorage
  private obtenerUsuarioId(): number {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario ? usuario.id : 0;  // 0 si no hay usuario
  }

  // Método para iniciar el carrito para un usuario
  iniciarCarrito(): void {
    const usuarioId = this.obtenerUsuarioId();

    // Llamada al servidor para obtener el carrito del usuario
    this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`).subscribe(
      (data) => {
        if (data.length > 0) {
          this.carrito.next(data);  // Si el carrito existe, lo asignamos
        } else {
          this.carrito.next([]);  // Si no existe, asignamos un carrito vacío
        }
      },
      (error) => {
        console.error('Error al obtener el carrito del servidor:', error);
        this.carrito.next([]);  // Si ocurre un error, asignamos un carrito vacío
      }
    );
  }

  // Método para agregar productos al carrito
  agregarAlCarrito(producto: any): void {
    const usuarioId = this.obtenerUsuarioId();
    const productosCarrito = [...this.carrito.value];
    const productoExistente = productosCarrito.find(p => p.ID_Producto === producto.ID_Producto);

    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      productosCarrito.push({ ...producto, cantidad: 1 });
    }

    this.carrito.next(productosCarrito);

    // Llamada al servidor para guardar el carrito actualizado
    this.http.post(`${this.apiUrl}/agregar`, { usuarioId, carrito: productosCarrito }).subscribe(
      (response) => {
        console.log('Carrito actualizado correctamente:', response);
      },
      (error) => {
        console.error('Error al actualizar el carrito en el servidor:', error);
      }
    );
  }

  // Método para obtener el total de productos en el carrito
  obtenerCantidadProductos(): number {
    return this.carrito.value.reduce((total, producto) => total + producto.cantidad, 0);
  }

  // Método para obtener el total del carrito
  obtenerTotalCarrito(): number {
    return this.carrito.value.reduce(
      (total, producto) => total + producto.Precio * producto.cantidad, 
      0
    );
  }

  // Método para vaciar el carrito
  vaciarCarrito(): void {
    this.carrito.next([]);
    const usuarioId = this.obtenerUsuarioId();

    // Llamada al servidor para vaciar el carrito
    this.http.post(`${this.apiUrl}/vaciar`, { usuarioId }).subscribe(
      (response) => {
        console.log('Carrito vaciado correctamente:', response);
      },
      (error) => {
        console.error('Error al vaciar el carrito en el servidor:', error);
      }
    );
  }
}
