import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/service.index';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;
  ahora = Date.now();
  paises = [{ nombre: 'Seleccione un país', bandera: ''}];

  constructor(public _usuarioService: UsuarioService,
              private router: Router) { }

  ngOnInit() {

    this.forma = new FormGroup({
        nombre: new FormControl(null, Validators.required),
        correo: new FormControl(null,
                              [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')],
                              this.validarEmail.bind(this)),
        empresa: new FormControl(null),
        fecha: new FormControl(null),
        pais: new FormControl(this.paises[0], [ Validators.required, this.validarPais ])
       });

    this._usuarioService.cargarPaises()
                    .subscribe( (resp: any) => {
                        resp.map( (pais) => {
                          this.paises.push({
                            nombre: pais.name,
                            bandera: pais.flag
                          });
                        });
                    });

  }

  registrarUsuario() {

    if (this.forma.invalid) {

      this.forma.get('nombre').markAsTouched();
      this.forma.get('correo').markAsTouched();
      this.forma.get('pais').markAsTouched();
      return;
    }

    this.forma.get('fecha').setValue(Date.now());


    this._usuarioService.crearUsuario(this.forma.value)
      .subscribe((resp: any) => {
        this._usuarioService.guardarLog(resp.name)
          .subscribe(respuesta => {
            this.router.navigate(['/accesslist']);
          });

      });


  }

  validarPais(control: FormControl): { [s: string]: boolean } {

    if (control.value.bandera ===  '' ) {
        return {
            validarPais: true
        };
    }

    return null;

  }


  validarEmail(control: FormControl): Promise<any> | Observable<any> {

    const promesa = new Promise( (resolve, rejected) => {

        this._usuarioService.comprobarEmail(control.value).subscribe(response => {

          if (response.error) {
            resolve({ validarEmail: true });
          } else {
            resolve(null);
          }
        });

      }
    );

    return promesa;

  }

}
