import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  productos: any[] = [];
  categorias: any[] = [];
  //productos: any[] = [];  // Array para almacenar los productos obtenidos desde la API
  stockCategoria: any[] = [];  // Array para almacenar los datos de stock por categoría
  productosMasVendidos: any[] = [];  // Array para almacenar los productos más vendidos
  pedidos: any[] = []; // Array para almacenar los datos de los pedidos
  mostrarModal: boolean = false; // Estado para controlar si el modal está visible o no
  categoriasMasVendidas: any[] = [];

  nuevoProducto: any = {
    Nombre: '',
    Descripcion: '',
    Precio: null,
    Stock: null,
    ID_Categoria: null,
    URL_Imagen: ''
  };

  productoEditado: any = {};  // Producto en edición
  selectedFile: File | null = null;
  imagenSeleccionada: File | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCategorias();
    //this.obtenerProductos();  // Llamamos a obtener los productos al iniciar el componente
    this.obtenerStockPorCategoria();  // Llamamos a obtener el reporte de stock por categoría
    this.obtenerProductosMasVendidos();  // Llamamos al método para obtener los productos más vendidos
    this.obtenerCategoriasMasVendidas();

  }

  obtenerProductos(): void {
    const apiUrl = 'http://localhost:3000/api/productos';

    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this.productos = response.productos;
        } else {
          console.error('No se pudieron obtener los productos');
        }
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
      }
    });
  }

  onFileSelected(event: any): void {
    this.imagenSeleccionada = event.target.files[0];
  }



agregarProducto(): void {
    // Validación de campos con SweetAlert
    if (!this.nuevoProducto.Nombre ||
        !this.nuevoProducto.Descripcion ||
        !this.nuevoProducto.Precio ||
        !this.nuevoProducto.Stock ||
        !this.nuevoProducto.ID_Categoria ||
        !this.imagenSeleccionada) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos',
        confirmButtonColor: '#d9534f'
      });
      return;
    }

    const formData = new FormData();
    formData.append('Nombre', this.nuevoProducto.Nombre);
    formData.append('Descripcion', this.nuevoProducto.Descripcion);
    formData.append('Precio', this.nuevoProducto.Precio.toString());
    formData.append('Stock', this.nuevoProducto.Stock.toString());
    formData.append('ID_Categoria', this.nuevoProducto.ID_Categoria.toString());
   
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
    }

    const apiUrl = 'http://localhost:3000/api/agregarProducto';
    this.http.post<any>(apiUrl, formData).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Producto Agregado',
            text: 'El producto se agregó exitosamente',
            confirmButtonColor: '#28a745'
          });
          this.obtenerProductos();
          // Limpiar el formulario
          this.nuevoProducto = {
            Nombre: '',
            Descripcion: '',
            Precio: null,
            Stock: null,
            ID_Categoria: null,
            URL_Imagen: ''
          };
          this.imagenSeleccionada = null;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar el producto',
            confirmButtonColor: '#d9534f'
          });
        }
      },
      error: (err) => {
        console.error('Error al agregar producto', err);
        Swal.fire({
          icon: 'error',
          title: 'Error de Servidor',
          text: 'Ocurrió un error al agregar el producto',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  obtenerCategorias(): void {
    const apiUrl = 'http://localhost:3000/api/categorias';

    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        if (response.success) {
          this.categorias = response.categorias;
          //console.log(this.categorias);
        } else {
          console.error('No se pudieron obtener las categorías');
        }
      },
      error: (err) => {
        console.error('Error al obtener categorías', err);
      }
    });
  }




  //EDITAR Y BORRAR PRODUCTO
  // Editar producto
  openEditModal(producto: any): void {
    // Rellenar el formulario con los datos del producto a editar
    this.productoEditado = { ...producto };
    this.selectedFile = null; // Resetea la imagen seleccionada al abrir el modal
    this.imagenSeleccionada = null;
    // Mostrar el modal
    const modal = document.getElementById('editProductModal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModal(): void {
    const modal = document.getElementById('editProductModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }
  
  




  editarProducto(): void {
    // Validación de campos
    if (!this.productoEditado.Nombre ||
        !this.productoEditado.Descripcion ||
        !this.productoEditado.Precio ||
        !this.productoEditado.Stock ||
        !this.productoEditado.ID_Categoria) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos',
        confirmButtonColor: '#d9534f'
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('Nombre', this.productoEditado.Nombre);
    formData.append('Descripcion', this.productoEditado.Descripcion);
    formData.append('Precio', this.productoEditado.Precio.toString());
    formData.append('Stock', this.productoEditado.Stock.toString());
    formData.append('ID_Categoria', this.productoEditado.ID_Categoria.toString());
  
   // Si se ha seleccionado una nueva imagen, la agregamos
if (this.imagenSeleccionada) {
  formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
} else {
  // Si no se seleccionó nueva imagen, enviamos la URL_Imagen actual
  // Asegúrate de que la propiedad 'imagen' sea de tipo 'URL_Imagen'
  formData.append('URL_Imagen', this.productoEditado.URL_Imagen || ''); // Evitar que sea undefined o null
}

  
    const apiUrl = `http://localhost:3000/api/editarProducto/${this.productoEditado.ID_Producto}`;
    this.http.put<any>(apiUrl, formData).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Producto Editado',
            text: 'El producto se editó exitosamente',
            confirmButtonColor: '#28a745'
          }).then(() => {
            // Cerrar modal manualmente
            const modalElement = document.getElementById('editProductModal');
            if (modalElement) {
              modalElement.style.display = 'none';
              document.body.classList.remove('modal-open');
              const backdropElement = document.querySelector('.modal-backdrop');
              if (backdropElement) {
                backdropElement.remove();
              }
            }
            this.obtenerProductos();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo editar el producto',
            confirmButtonColor: '#d9534f'
          });
        }
      },
      error: (err) => {
        console.error('Error al editar producto', err);
        Swal.fire({
          icon: 'error',
          title: 'Error de Servidor',
          text: 'Ocurrió un error al editar el producto',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

// Eliminar producto
// Eliminar producto
eliminarProducto(productoId: number): void {
  // Usar SweetAlert2 para la confirmación
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Una vez eliminado, no podrás recuperar este producto.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const apiUrl = `http://localhost:3000/api/eliminarProducto/${productoId}`;
      this.http.delete<any>(apiUrl).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
            this.obtenerProductos();
          } else {
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
          }
        },
        error: (err) => {
          console.error('Error al eliminar producto', err);
          Swal.fire('Error', 'Ocurrió un error al eliminar el producto', 'error');
        }
      });
    }
  });
}



// Método para obtener el reporte de stock por categoría desde la API
obtenerStockPorCategoria(): void {
  const apiUrl = 'http://localhost:3000/api/reportes/stock-categoria';  // URL del endpoint de la vista

  this.http.get<any>(apiUrl).subscribe({
    next: (response) => {
      if (response.success) {
        this.stockCategoria = response.stock;  // Almacena los datos de stock por categoría
      } else {
        console.error('No se pudo obtener el stock por categoría');
      }
    },
    error: (err) => {
      console.error('Error al obtener stock por categoría', err);
    }
  });
}

// Método para obtener los productos más vendidos desde la API
obtenerProductosMasVendidos(): void {
  const apiUrl = 'http://localhost:3000/api/productos-mas-vendidos';  // URL del endpoint de la vista

  this.http.get<any>(apiUrl).subscribe({
    next: (response) => {
      if (response.success) {
        this.productosMasVendidos = response.productos;  // Almacena los productos más vendidos
      } else {
        console.error('No se pudieron obtener los productos más vendidos');
      }
    },
    error: (err) => {
      console.error('Error al obtener productos más vendidos', err);
    }
  });
}



// Método para cerrar el modal
cerrarModal2(): void {
  this.mostrarModal = false;
}


  // Método para obtener categorías con ventas mayores a 5000
obtenerCategoriasMasVendidas(): void {
const apiUrl = 'http://localhost:3000/api/categorias-mas-vendidas';

this.http.get<any>(apiUrl).subscribe({
  next: (response) => {
    if (response.success) {
      console.log('Categorías con ventas mayores a 5000:', response.categorias);
      this.categoriasMasVendidas = response.categorias;  // Almacena los resultados
    } else {
      console.error('No se pudieron obtener las categorías más vendidas');
    }
  },
  error: (err) => {
    console.error('Error al obtener las categorías más vendidas:', err);
  }
});
}


  
}