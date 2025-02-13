import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Perro } from '../perro.model'; 
import { mergeMap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicioApiService {
  private apiUrl = 'https://api.thedogapi.com/v1/breeds';
  private imageApiUrl = 'https://api.thedogapi.com/v1/images/search';
  constructor(private http: HttpClient) { }

  // getData(): Observable<Perro[]> {
  //   return this.http.get<Perro[]>(this.apiUrl).pipe(
  //     mergeMap(data => this.getImages(data))
  //   );
  // }
  
  getData(): Observable<Perro[]> {
    return this.http.get<Perro[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejar errores específicos aquí
        if (error.status === 429) {
          console.log('Demasiadas solicitudes. Inténtalo de nuevo más tarde.');
        }
        return throwError(error);
      }),
      mergeMap(data => this.getImages(data))
    );
  }

  // getImages(data: Perro[]): Observable<Perro[]> {
  //   const requests = data.map(perro => {
  //     return this.http.get<ImageResponse[]>(`${this.imageApiUrl}?breed_name=${perro.name}`);
  //   });
  
  getImages(data: Perro[]): Observable<Perro[]> {
    const requests = data.map(perro => {
      return this.http.get<ImageResponse[]>(`${this.imageApiUrl}?breed_name=${perro.name}`).pipe(
        catchError((error: HttpErrorResponse) => {
          // Manejar errores específicos aquí
          if (error.status === 429) {
            console.log(`No se encontraron imágenes para ${perro.name}`);
          }
          return throwError(error);
        })
      );
    });

    return forkJoin(requests).pipe(
      map((responses: ImageResponse[][]) => {
        responses.forEach((response, index) => {
          const imageUrl = response.length > 0 ? response[0].url : ''; // Obtener la primera imagen de la respuesta
          data[index].imageUrl = imageUrl;
        });
        return data;
      })
    );
  }
}


interface ImageResponse {
  url: string;
}

