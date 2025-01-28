import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  errorMessage: string = ''; // Variable para almacenar el mensaje de error
  constructor(private http: HttpClient, private router: Router) {}

  // envío de los datos de login
  onLoginSubmit(): void {
    const url = 'http://192.168.50.20:3001/login';

    this.http.post<{ userId: number }>(url, this.loginData).subscribe(
      (response) => {
        if (response && response.userId) {
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('username', this.loginData.username);

          // Redirigir a la página de inicio después de loguearse
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        } else {
          console.log('Login fallido: Respuesta inesperada del servidor');
          alert('Error en el login. Por favor, verifica tus credenciales.');
        }
      },
      (error) => {
         this.showError('Usuario o contraseña incorrectos. Intenta nuevamente.');
      }
    );
  }
showError(message: string) {
  this.errorMessage = message; 
  setTimeout(() => {
    this.errorMessage = ''; 
  }, 2000); 
}

}


