import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/service.index';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  forma: FormGroup;
  messageError = false;

  constructor(public _usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit() {

    if (this._usuarioService.estaLogueado()) {
      this.router.navigate(['/accesslist']);
    }


    this.forma = new FormGroup({
      correo: new FormControl(null,
        [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])
    });
  }

  ingresar() {

    if (this.forma.invalid) {
      this.forma.get('correo').markAsTouched();
      return;
    }


    this._usuarioService.login(this.forma.get('correo').value)
      .subscribe(resp => {

        if (resp.ok) {

          this._usuarioService.guardarLog( resp.key )
            .subscribe( respuesta => {
              this.router.navigate(['/accesslist']);
            });


        } else {
          this.messageError = true;
        }

      });


  }

}
