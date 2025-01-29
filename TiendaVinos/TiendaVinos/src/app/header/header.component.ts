import { Component, OnInit } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { CartService } from '../cart.service';



import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']  // Corregido el nombre de la propiedad `styleUrl` a `styleUrls`
})
export class HeaderComponent implements OnInit {
  usuarioInput: string = '';  // Campo del formulario (correo)
  contra: string = '';  // Campo del formulario (contraseña)
  usuario: any = null;  // Información del usuario logueado
  mostrarLogin: boolean = false;  // Modal de login


  constructor(private cartService: CartService, private http: HttpClient, private router: Router) {}

  carritoCantidad: number = 0;  // Número de productos en el carrito
  usuarioId: number = 1;  // Asegúrate de obtener el usuarioId de la sesión
  carritoVisible: boolean = false;
  carrito: any[] = [];  // Productos en el carrito
  totalCarrito: number = 0;  // Total del carrito

  


  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const usuarioGuardado = localStorage.getItem('usuario');
      if (usuarioGuardado) {
        this.usuario = JSON.parse(usuarioGuardado);
        this.usuarioId = this.usuario.id;  // Recuperar el usuarioId
        this.cartService.iniciarCarrito();  // Iniciar el carrito para este usuario

        // Subscribir a cambios en el carrito
        this.cartService.carrito$.subscribe((productos) => {
          this.carrito = productos;
          this.totalCarrito = this.cartService.obtenerTotalCarrito();  // Actualizar total
          this.carritoCantidad = this.cartService.obtenerCantidadProductos();  // Actualizar cantidad
        });
      }
    }
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  // Método para login
  login() {
    if (!this.usuarioInput || !this.contra) {
      alert("Por favor, ingresa usuario y contraseña.");
      return;
    }

    const loginData = { usuario: this.usuarioInput, contraseña: this.contra };

    this.http.post('http://localhost:3000/api/login', loginData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.usuario = response.usuario;  // Almacena la información del usuario
          this.usuarioId = this.usuario.id; // Establece el usuarioId
          localStorage.setItem('usuario', JSON.stringify(this.usuario));  // Persistir sesión
          this.mostrarLogin = false;  // Cerrar modal
          alert("¡Login exitoso!");
          this.cartService.iniciarCarrito();  // Iniciar el carrito al hacer login
          location.reload(); // Recarga la página
        } else {
          alert("Usuario o contraseña incorrectos.");
        }
      },
      error: (err) => {
        console.error("Error en login", err);
        alert("Error al iniciar sesión.");
      }
    });
  }

  // Método para logout

  logout() {
    this.usuario = null;
    localStorage.removeItem('usuario');  // Eliminar sesión
    this.cartService.vaciarCarrito();  // Vaciar el carrito al cerrar sesión
    this.router.navigate(['/home']);  // Redirigir a la página de inicio

  }

  // Verificar si el usuario es "Admin"
  esAdministrador(): boolean {
    return this.usuario && this.usuario.nombre === 'Admin';
  }
}
