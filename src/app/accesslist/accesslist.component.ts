import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/service.index';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-accesslist',
  templateUrl: './accesslist.component.html',
  styleUrls: ['./accesslist.component.css']
})
export class AccesslistComponent implements OnInit {

  usuarios: any[];
  logs: any[] = [];

  constructor(public _usuarioService: UsuarioService) { }

  ngOnInit() {

    this._usuarioService.obtenerLogs()
      .subscribe((logsAll: any) => {

        const arr: any [] = [];

        for ( const key$ in logsAll) {

          if (logsAll.hasOwnProperty(key$)) {
            arr.push(logsAll[key$]);
          }

        }

        this.logs = arr.sort( (a, b) => b.fecha - a.fecha );

      });

    this._usuarioService.obtenerUsuarios()
      .subscribe((users: any) => {
        this.usuarios = users;
      });
  }

}
