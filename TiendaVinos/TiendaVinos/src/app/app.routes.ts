import { Routes } from '@angular/router';
import { InventarioComponent } from './inventario/inventario.component';
import { AltaProveedoresComponent } from './alta-proveedores/alta-proveedores.component';
import { BajaProveedoresComponent } from './baja-proveedores/baja-proveedores.component';
import { AltaProductoComponent } from './alta-producto/alta-producto.component';
import { BajaProductoComponent } from './baja-producto/baja-producto.component';
import { AltaEmpleadoComponent } from './alta-empleado/alta-empleado.component';
import { BajaEmpleadoComponent } from './baja-empleado/baja-empleado.component';
import { AltaOrdenProduccionComponent } from './alta-orden-produccion/alta-orden-produccion.component';
import { BajaOrdenProduccionComponent } from './baja-orden-produccion/baja-orden-produccion.component';
import { HomeComponent } from './home/home.component';
import { ProductosComponent } from './productos/productos.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

export const routes: Routes = [
    { path: 'inventario', component: InventarioComponent },
    { path: 'alta-proveedores', component: AltaProveedoresComponent },
    { path: 'baja-proveedores', component: BajaProveedoresComponent },
    { path: 'alta-producto', component: AltaProductoComponent },
    { path: 'baja-producto', component: BajaProductoComponent }, 
    { path: 'alta-empleado', component: AltaEmpleadoComponent }, 
    { path: 'baja-empleado', component: BajaEmpleadoComponent }, 
    { path: 'alta-orden-produccion', component: AltaOrdenProduccionComponent }, 
    { path: 'baja-orden-produccion', component: BajaOrdenProduccionComponent }, 
    { path: 'home', component: HomeComponent },
    { path: 'edit-product', component: EditProductComponent },
    { path: '', component: HomeComponent },
    {path: 'productos', component: ProductosComponent},
    {path: 'nosotros', component: NosotrosComponent},
    {path: 'productos', component: ProductosComponent},
    { path: 'nosotros', component: NosotrosComponent},
    { path: 'configuracion', component: ConfiguracionComponent }
];

