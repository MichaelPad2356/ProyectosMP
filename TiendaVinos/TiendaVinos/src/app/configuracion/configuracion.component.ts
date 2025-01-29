import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

interface VentaRollup {
  Nombre_Categoria: string;
  Fecha_Pedido: string;
  Total_Ventas: number;
}

interface UsuarioTop {
  ID_Usuario: string;
  Nombre_Usuario: string;
  Total_Compras: number;
  Total_Ventas: number;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [RouterModule, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
  usuarios: any[] = [];  // Array para almacenar los usuarios
  usuarioNuevo = {
    Nombre: '',
    Apellido: '',
    Correo: '',
    Contra: '',
    Tipo: '',
    ID_Municipio: null
  };


  usuarioEditado = {
    ID_Usuario: null,
    Nombre: '',
    Apellido: '',
    Correo: '',
    Contra: '',
    Tipo: '',
    ID_Municipio: null
  };

  //********************************CATEGORIA**************************************** */
  categorias: any[] = []; // Almacena la lista de categorías
  categorias2: any[] = []; // Almacena la lista de categorías
  nuevaCategoria: any = { Nombre_Categoria: '' }; // Modelo para una nueva categoría
  categoriaEditada: any = {}; // Objeto para edición
  isEditCategoryModalOpen: boolean = false; // Control para el modal de edición


  cantidadPorCategoria: Array<any> = []; // Almacena resultados por categoría seleccionada

  // Variable para almacenar la categoría seleccionada
  idCategoria: number | null = null;

  //************************************************************************************ */
  estados: any[] = []; // Lista de estados
  nuevoEstado: string = ''; // Almacenar el nombre del nuevo estado
  estadoEditado: any = {
    ID_EstadoDirc: null,
    Nombre_EstadoDirc: ''
  };

  //************************************************************************************** */
  municipios: any[] = [];
  nuevoMunicipio = { Nombre_Municipio: '', ID_EstadoDirc: '' };
  municipioEditado: any = {
    ID_Municipio: null,
    Nombre_Municipio: '',
    ID_EstadoDirc: null
  };

  //************************************************************************************** */
  pedidosDetalles: any[] = [];
  pagosDetalles: any[] = [];

  //***************************************************************************************** */

  fechaInicio: string = '';
  fechaFin: string = '';
  resultados: any[] = [];

  //******************************************************************************************* */

  mostrarModal: boolean = false; // Estado para controlar si el modal está visible o no
  pedidos: any[] = []; // Array para almacenar los datos de los pedidos

  
  usuariosTop: UsuarioTop[] = [];
  totalGeneral: UsuarioTop | null = null;
  ventasRollup: VentaRollup[] = [];

  constructor(private http: HttpClient) {}

  // Método para obtener los usuarios
  obtenerUsuarios(): void {
    this.http.get<any[]>('http://localhost:3000/api/usuarios').subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al obtener usuarios', err);
      }
    });
  }

  // Método para abrir el modal de agregar usuario
  openAddUserModal(): void {
    // Resetear formulario
    this.usuarioNuevo = {
      Nombre: '',
      Apellido: '',
      Correo: '',
      Contra: '',
      Tipo: '',
      ID_Municipio: null
    };
    // Abre el modal de agregar usuario
    document.getElementById('addUserModal')?.classList.add('show');
  }

  // Método para cerrar el modal
  closeModal(): void {
    document.getElementById('addUserModal')?.classList.remove('show');
  }

  // Método para agregar un nuevo usuario
  agregarUsuario(): void {

    if (!this.usuarioNuevo.Nombre || !this.usuarioNuevo.Apellido || !this.usuarioNuevo.Correo || !this.usuarioNuevo.Contra || !this.usuarioNuevo.Tipo || !this.usuarioNuevo.ID_Municipio) {
      Swal.fire({
          icon: 'warning',
          title: 'Campos Incompletos',
          text: 'Por favor, complete todos los campos antes de agregar un usuario.',
          confirmButtonText: 'Entendido'
      });
      return;
  }



    const apiUrl = 'http://localhost:3000/api/agregarUsuario';
    this.http.post(apiUrl, this.usuarioNuevo).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Usuario agregado correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.obtenerUsuarios(); // Actualiza la lista de usuarios
          this.closeModal(); // Cierra el modal
        });
      },
      error: (err) => {
        console.error('Error al agregar usuario', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al agregar el usuario',
          confirmButtonText: 'Entendido'
        });
      }
    });
  }




  //Metodo para editar un usuario
    // Método para abrir el modal de editar usuario
    openEditUserModal(usuario: any): void {
      // Carga los datos del usuario seleccionado en el objeto usuarioEditado
      this.usuarioEditado = { ...usuario }; // Copiamos los datos
      document.getElementById('editUserModal')?.classList.add('show');
    }
  
    // Método para cerrar el modal
    closeModal2(): void {
      document.getElementById('editUserModal')?.classList.remove('show');
    }
  
    // Método para actualizar un usuario
   // Método para actualizar un usuario
actualizarUsuario(): void {
  const apiUrl = `http://localhost:3000/api/editarUsuario/${this.usuarioEditado.ID_Usuario}`;
  this.http.put(apiUrl, this.usuarioEditado).subscribe({
    next: (response) => {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Usuario actualizado correctamente',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.obtenerUsuarios(); // Actualiza la lista de usuarios
        this.closeModal(); // Cierra el modal
      });
    },
    error: (err) => {
      console.error('Error al actualizar usuario', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al actualizar el usuario',
        confirmButtonText: 'Entendido'
      });
    }
  });
}




  // Método para eliminar un usuario
  deleteUser(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const apiUrl = `http://localhost:3000/api/eliminarUsuario/${id}`;
        this.http.delete(apiUrl).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'Usuario eliminado correctamente',
              confirmButtonText: 'Aceptar'
            });
            this.obtenerUsuarios(); // Actualiza la lista de usuarios después de la eliminación
          },
          error: (err) => {
            console.error('Error al eliminar usuario', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema al eliminar el usuario',
              confirmButtonText: 'Entendido'
            });
          }
        });
      }
    });
  }

    //******************************************************************************************************************************************************************** */
    //Seccion de categorias
     // Método para obtener la lista de categorías
  obtenerCategorias(): void {
    this.http.get<any[]>('http://localhost:3000/api/categorias2').subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener categorías', err);
      }
    });
  }


  obtenerCategorias2(): void {
    this.http.get<any[]>('http://localhost:3000/api/categorias3').subscribe({
      next: (data2) => {
        this.categorias2 = data2;
      },
      error: (err) => {
        console.error('Error al obtener categorías', err);
      }
    });
  }


  // Abrir modal para agregar una categoría
  openAddCategoryModal(): void {
    const modal = document.getElementById('addCategoryModal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  // Cerrar el modal después de agregar
  closeAddCategoryModal(): void {
    const modal = document.getElementById('addCategoryModal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  // Método para agregar una nueva categoría
  agregarCategoria(): void {
    const apiUrl = 'http://localhost:3000/api/agregarCategoria';
  
    this.http.post(apiUrl, this.nuevaCategoria).subscribe({
      next: (response) => {
        this.closeAddCategoryModal();
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Categoría agregada correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.obtenerCategorias(); // Actualiza la lista después de agregar
          this.nuevaCategoria = { Nombre_Categoria: '' }; // Limpia el formulario
          this.closeAddCategoryModal(); // Cierra el modal
        });
      },
      error: (err) => {
        console.error('Error al agregar categoría', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema al agregar la categoría',
          confirmButtonText: 'Entendido'
        });
      }
    });
  }



 // Abrir modal para editar una categoría
openEditCategoryModal(categoria: any): void {
  this.categoriaEditada = { ...categoria }; // Clonar la categoría seleccionada
  const modal = document.getElementById('editCategoryModal') as HTMLDialogElement;
  if (modal) {
    modal.showModal(); // Abre el modal
  }
}

// Cerrar el modal de editar
closeEditCategoryModal(): void {
  const modal = document.getElementById('editCategoryModal') as HTMLDialogElement;
  if (modal) {
    modal.close(); // Cierra el modal
  }
}

// Guardar cambios en la categoría
editarCategoria(): void {
  const apiUrl = `http://localhost:3000/api/editarCategoria/${this.categoriaEditada.ID_Categoria}`;
  this.http.put(apiUrl, this.categoriaEditada).subscribe({
    next: (response) => {
      this.closeEditCategoryModal(); // Cerrar el modal
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Categoría actualizada correctamente',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.closeEditCategoryModal(); // Cerrar el modal
        this.obtenerCategorias(); // Actualizar la lista
      });
    },
    error: (err) => {
      console.error('Error al editar la categoría:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al editar la categoría',
        confirmButtonText: 'Entendido'
      });
    }
  });
}


// Eliminar una categoría
deleteCategory(categoriaId: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const apiUrl = `http://localhost:3000/api/eliminarCategoria/${categoriaId}`;
      this.http.delete(apiUrl).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Categoría eliminada correctamente',
            confirmButtonText: 'Aceptar'
          });
          this.obtenerCategorias(); // Actualizar la lista de categorías
        },
        error: (err) => {
          console.error('Error al eliminar categoría:', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un problema al eliminar la categoría',
            confirmButtonText: 'Entendido'
          });
        }
      });
    }
  });
 }


//********************************************************************************************************************************************************************** */
 // Obtener todos los estados
 obtenerEstados(): void {
  this.http.get<any[]>('http://localhost:3000/api/estados').subscribe({
    next: (data) => {
      this.estados = data;
    },
    error: (err) => {
      console.error('Error al obtener estados:', err);
    }
  });
}

// Abrir el modal para agregar un nuevo estado
openAddStateModal(): void {
  this.nuevoEstado = ''; // Limpiar el input
  const modal = document.getElementById('addStateModal') as HTMLDialogElement;
  modal?.showModal(); // Mostrar el modal
}

// Cerrar el modal
closeAddStateModal(): void {
  const modal = document.getElementById('addStateModal') as HTMLDialogElement;
  modal?.close(); // Cerrar el modal
}

// Agregar un nuevo estado
agregarEstado(): void {
  if (!this.nuevoEstado) {
    this.closeAddStateModal();
    Swal.fire({
      icon: 'warning',
      title: 'Campo Vacío',
      text: 'Por favor, ingresa el nombre del estado.',
      confirmButtonText: 'Entendido'
    });
    return;
  }
 
  const newState = {
    Nombre_EstadoDirc: this.nuevoEstado
  };
 
  // Realizar la solicitud HTTP para agregar el nuevo estado
  this.http.post('http://localhost:3000/api/agregarEstado', newState).subscribe({
    next: (response) => {
      this.closeAddStateModal();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Estado agregado correctamente',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.obtenerEstados(); // Actualizar la lista de estados
        this.closeAddStateModal(); // Cerrar el modal
      });
    },
    error: (err) => {
      console.error('Error al agregar estado:', err);
      this.closeAddStateModal();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al agregar el estado',
        confirmButtonText: 'Entendido'
      });
    }
  });
 }

  // Abrir el modal para editar el estado
openEditStateModal(estado: any): void {
  this.estadoEditado = { ...estado }; // Copiar los datos del estado seleccionado
  const modal = document.getElementById('editStateModal') as HTMLDialogElement;
  modal?.showModal(); // Mostrar el modal
}

// Cerrar el modal de edición
closeEditStateModal(): void {
  const modal = document.getElementById('editStateModal') as HTMLDialogElement;
  modal?.close(); // Cerrar el modal
}

// Función para editar el estado
editarEstado(): void {
  const apiUrl = `http://localhost:3000/api/editarEstado/${this.estadoEditado.ID_EstadoDirc}`;
  const body = {
    Nombre_EstadoDirc: this.estadoEditado.Nombre_EstadoDirc
  };
 
  this.http.put<any>(apiUrl, body).subscribe({
    next: (response) => {
      if (response.success) {
        this.closeEditStateModal(); // Cerrar el modal
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Estado actualizado correctamente',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.obtenerEstados(); // Obtener la lista actualizada de estados
          this.closeEditStateModal(); // Cerrar el modal
        });
      } else {
        this.closeEditStateModal(); // Cerrar el modal
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'No se pudo actualizar el estado',
          confirmButtonText: 'Entendido'
        });
      }
    },
    error: (err) => {
      console.error('Error al editar estado', err);
      this.closeEditStateModal(); // Cerrar el modal
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema al editar el estado',
        confirmButtonText: 'Entendido'
      });
    }
  });
 }


// Función para eliminar un estado
deleteState(idEstado: number): void {
  // Confirmar si el usuario desea eliminar el estado
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      // Hacer la solicitud de eliminación al servidor
      const apiUrl = `http://localhost:3000/api/eliminarEstado/${idEstado}`;
      this.http.delete<any>(apiUrl).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire(
              '¡Eliminado!',
              'El estado ha sido eliminado correctamente.',
              'success'
            );
            this.obtenerEstados(); // Obtener la lista actualizada de estados
          } else {
            Swal.fire(
              'Error',
              'No se pudo eliminar el estado.',
              'error'
            );
          }
        },
        error: (err) => {
          console.error('Error al eliminar estado', err);
          Swal.fire(
            'Error',
            'Ocurrió un error al intentar eliminar el estado.',
            'error'
          );
        }
      });
    }
  });
}
//************************************************************************************************************************************************************************ */
// Función para abrir el modal de agregar municipio
openAddMunicipalityModal() {
  const modal = document.getElementById('addMunicipalityModal') as HTMLDialogElement;
  modal.showModal(); // Mostrar el modal
}

// Función para agregar un municipio
agregarMunicipio(): void {
  const apiUrl = 'http://localhost:3000/api/agregarMunicipio';
  this.http.post<any>(apiUrl, this.nuevoMunicipio).subscribe({
    next: (response) => {
      this.closeAddMunicipalityModal(); // Cerrar el modal
      if (response.success) {
        Swal.fire(
          '¡Agregado!',
          'El municipio ha sido agregado correctamente.',
          'success'
        );
        this.obtenerMunicipios(); // Obtener la lista actualizada de municipios
        this.closeAddMunicipalityModal(); // Cerrar el modal
      } else {
        Swal.fire(
          'Error',
          'No se pudo agregar el municipio.',
          'error'
        );
      }
    },
    error: (err) => {
      console.error('Error al agregar municipio', err);
      this.closeAddMunicipalityModal(); // Cerrar el modal
      Swal.fire(
        'Error',
        'Ocurrió un error al intentar agregar el municipio.',
        'error'
      );
    }
  });
}

// Función para cerrar el modal de agregar municipio
closeAddMunicipalityModal() {
  const modal = document.getElementById('addMunicipalityModal') as HTMLDialogElement;
  modal.close();
}

// Función para obtener todos los municipios
obtenerMunicipios() {
  const apiUrl = 'http://localhost:3000/api/obtenerMunicipios';
  this.http.get<any[]>(apiUrl).subscribe({
    next: (data) => {
      this.municipios = data;
    },
    error: (err) => {
      console.error('Error al obtener municipios', err);
    }
  });
}


// Método para abrir el modal de edición
openEditMunicipalityModal(municipio: any) {
  this.municipioEditado = { ...municipio }; // Clonamos los datos del municipio
  const modal = document.getElementById('editMunicipalityModal') as HTMLDialogElement;
  modal?.showModal(); // Mostramos el modal
}

// Método para cerrar el modal de edición
closeEditMunicipalityModal() {
  const modal = document.getElementById('editMunicipalityModal') as HTMLDialogElement;
  modal?.close(); // Cerramos el modal
}

editarMunicipality(): void {
  const updatedMunicipality = this.municipioEditado;

  // Llamada al servidor para actualizar el municipio
  const data = {
    ID_Municipio: updatedMunicipality.ID_Municipio,
    Nombre_Municipio: updatedMunicipality.Nombre_Municipio,
    ID_EstadoDirc: updatedMunicipality.ID_EstadoDirc
  };

  fetch('http://localhost:3000/api/editarMunicipio', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json' // Asegúrate de indicar que los datos son JSON
    },
    body: JSON.stringify(data) // Convertir los datos a JSON
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        this.closeEditMunicipalityModal();
        Swal.fire(
          '¡Actualizado!',
          'El municipio ha sido actualizado correctamente.',
          'success'
        );
        this.obtenerMunicipios(); // Actualizar la lista de municipios
        this.closeEditMunicipalityModal();
      } else {
        this.closeEditMunicipalityModal();
        Swal.fire(
          'Error',
          'No se pudo actualizar el municipio.',
          'error'
        );
      }
    })
    .catch(error => {
      console.error('Error al editar el municipio:', error);
      Swal.fire(
        'Error',
        'Ocurrió un error en la conexión.',
        'error'
      );
    });
}

// Método para eliminar un municipio
deleteMunicipality(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'No podrás revertir esta acción.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3000/api/eliminarMunicipio/${id}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            Swal.fire(
              '¡Eliminado!',
              'El municipio ha sido eliminado correctamente.',
              'success'
            );
            this.obtenerMunicipios(); // Actualizar la lista de municipios
          } else {
            Swal.fire(
              'Error',
              'No se pudo eliminar el municipio.',
              'error'
            );
          }
        })
        .catch(error => {
          console.error('Error al eliminar el municipio:', error);
          Swal.fire(
            'Error',
            'Ocurrió un error en la conexión.',
            'error'
          );
        });
    }
  });
}



//**************************************************************************************************************************************************************** */
  // Obtener pedidos con detalles de productos y categorías
  getPedidosDetalles() {
    this.http.get<any[]>('http://localhost:3000/api/configuracion/pedidos-detalles')
      .subscribe(
        (data) => {
          this.pedidosDetalles = data;
        },
        (error) => {
          console.error('Error al obtener pedidos con detalles', error);
        }
      );
  }

  // Obtener pagos con detalles de usuario y estado de envío
  getPagosDetalles() {
    this.http.get<any[]>('http://localhost:3000/api/configuracion/pagos-detalles')
      .subscribe(
        (data) => {
          this.pagosDetalles = data;
        },
        (error) => {
          console.error('Error al obtener pagos con detalles', error);
        }
      );
  }



  actualizarEnvio() {
    this.http.get('http://localhost:3000/actualizar-envio', { responseType: 'text' })
      .subscribe(
        response => {
          console.log('Respuesta del servidor:', response);
          alert('El estado de los envíos ha sido actualizado.');
        },
        error => {
          console.error('Error al actualizar los envíos:', error);
          alert('Hubo un error al actualizar los envíos.');
        }
      );
  }

  //******************************************************************************************************************************* */
  //PROCEDIMIENTO 1
   // Función que se llama al enviar el formulario
   consultarVentas() {
    if (!this.fechaInicio || !this.fechaFin) {
      alert("Por favor, ingrese ambas fechas.");
      return;
    }
  
    // Crea HttpParams de manera explícita
    let params = new HttpParams()
      .set('fechaInicio', this.fechaInicio)
      .set('fechaFin', this.fechaFin);
  
    console.log('Params sendo:', params.toString());
  
    this.http.get<any[]>('http://localhost:3000/api/ventas-por-categoria', { params })
      .subscribe({
        next: (data) => {
          this.resultados = data;
          console.log('Datos recibidos:', data);
        },
        error: (error) => {
          console.error('Error completo:', error);
          console.error('Status:', error.status);
          console.error('Mensaje:', error.message);
          console.error('Error body:', error.error);
        }
      });
  }

  //********************************************************************************************************************************************** */
  obtenerCantidadProductos(): void {
    // Validate category selection
    if (!this.idCategoria) {
        alert('Por favor, seleccione una categoría.');
        return;
    }

    // Make GET request with route parameter
    this.http.get<any>(`http://localhost:3000/api/contar/${this.idCategoria}`)
    .subscribe({
        next: (data) => {
            // Find selected category
            const categoriaSeleccionada = this.categorias.find(
                (cat) => cat.id === this.idCategoria
            );

            // Add result to results table
            this.cantidadPorCategoria = [
                ...this.cantidadPorCategoria, 
                {
                    categoriaId: this.idCategoria,
                    nombre: categoriaSeleccionada?.nombre || 'Desconocido',
                    cantidad: data.cantidad,
                }
            ];
        },
        error: (err) => {
            console.error('Error al obtener el conteo:', err);
            
            // Detailed error handling
            if (err.status === 400) {
                alert('Debe seleccionar una categoría válida.');
            } else if (err.status === 500) {
                alert('Hubo un error en el servidor. Inténtelo de nuevo.');
            } else {
                alert('Error desconocido al obtener la cantidad de productos.');
            }
        }
    });
}


//************************************************************************************************************ */
// Método para abrir el modal
      abrirModal(): void {
        this.mostrarModal = true;
        this.obtenerPedidos(); // Cargar los pedidos cuando se abre el modal
      }

      // Método para cerrar el modal
      cerrarModal(): void {
        this.mostrarModal = false;
      }

        // Método para obtener los pedidos desde el servidor
        obtenerPedidos(): void {
          const apiUrl = 'http://localhost:3000/api/pedidos'; // Cambia la URL si es necesario
        
          this.http.get<any>(apiUrl).subscribe({
            next: (response) => {
              if (response.success) {
                this.pedidos = response.pedidos; // Asegúrate de usar el nombre correcto del campo
                console.log(this.pedidos); // Verifica en la consola que los datos se carguen correctamente
              } else {
                console.error('No se pudieron obtener los pedidos:', response.message);
              }
            },
            error: (err) => {
              console.error('Error al obtener pedidos:', err);
            }
            });
          }


      obtenerVentasRollup() {
        const url = 'http://localhost:3000/api/ventas/rollup';
    
        this.http.get<{success: boolean, ventasRollup: VentaRollup[]}>(url).subscribe({
          next: (response) => {
            if (response.success) {
              this.ventasRollup = response.ventasRollup;
              console.log('Datos de ventas con ROLLUP:', this.ventasRollup);
            }
          },
          error: (err) => {
            console.error('Error al obtener ventas', err);
          }
        });
      }


      obtenerUsuariosTop() {
        const url = 'http://localhost:3000/api/usuarios/top-compras-cube';
    
        this.http.get<{
          success: boolean, 
          usuariosTop: UsuarioTop[], 
          totalGeneral: UsuarioTop
        }>(url).subscribe({
          next: (response) => {
            if (response.success) {
              this.usuariosTop = response.usuariosTop;
              this.totalGeneral = response.totalGeneral;
            }
          },
          error: (err) => {
            console.error('Error al obtener usuarios top', err);
          }
        });
      }


  ngOnInit(): void {
    this.obtenerUsuarios(); // Al iniciar el componente, obtiene los usuarios
    this.obtenerCategorias(); // Carga inicial de categorías
    this.obtenerCategorias2(); // Carga inicial de categorías
    this.obtenerEstados(); // Cargar los estados al iniciar
    this.obtenerMunicipios(); //Se cargan los municipios al iniciar
    this.getPedidosDetalles();
    this.getPagosDetalles();
    this.obtenerVentasRollup();
    this.obtenerUsuariosTop();
  }
}