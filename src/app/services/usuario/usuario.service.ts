import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { map, filter, delay } from 'rxjs/operators';



@Injectable()
export class UsuarioService {

  email: string;
  paises: string[];
  usuariosURL = 'https://ilusion-26c6e.firebaseio.com/usuarios.json';
  logsURL = 'https://ilusion-26c6e.firebaseio.com/logs.json';

  constructor(public http: HttpClient, public router: Router) {
    this.cargarStorage();
  }

  login(email: string) {
    localStorage.removeItem('email');

    return this.http.get(this.usuariosURL).pipe(
      map(response => {

        for (const key$ in response) {
          if (response[key$].correo === email) {
            this.guardarStorage(email);
            return {
              ok: 'ok',
              key: key$
            };
          }
        }

        return { message: 'Email no registrado' };
      })
    );
  }

  guardarLog(key: string) {
    const body = JSON.stringify({
      fecha: Date.now(),
      userId: key
    });
    return this.http.post(this.logsURL, body);
  }

  logout() {
    this.email = null;
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }

  guardarStorage(email: string) {
    localStorage.setItem('email', email);
    this.email = email;
  }

  estaLogueado() {
    return this.email ? true : false;
  }

  cargarStorage() {
    if (localStorage.getItem('email')) {
      this.email = localStorage.getItem('email');
    } else {
      this.email = '';
    }
  }

  cargarPaises() {
    const URL = 'https://restcountries.eu/rest/v2/all';
    return this.http.get(URL);
  }

  crearUsuario(usuario: any) {
    const body = JSON.stringify(usuario);
    return this.http.post(this.usuariosURL, body).pipe(
      map(response => {
        this.guardarStorage(usuario.correo);
        return response;
      })
    );
  }

  obtenerUsuarios() {
    return this.http.get(this.usuariosURL).pipe(
      map(users => {
        return users;
      })
    );
  }

  obtenerLogs() {

    return this.http.get(this.logsURL)
      .pipe(
        map(logs => {
           return logs;
        })
      );
  }

  comprobarEmail(email: string) {
    return this.http.get(this.usuariosURL).pipe(
      map(response => {
        for (const key$ in response) {
          if (response[key$].correo === email) {
            return {
              error: true,
              message: 'Este email ya esta siendo utilizado'
            };
          }
        }

        return { message: 'Puede usar este email' };
      })
    );
  }
}
