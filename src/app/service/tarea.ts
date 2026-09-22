import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TareasObj } from '../components/dashboard/dashboard';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TareaService {
    private urlBase = 'http://localhost:8081/tareas';

    constructor(private http: HttpClient) { }

    getAll(): Observable<TareasObj[]> {
        return this.http.get<TareasObj[]>(this.urlBase);
    }

    getById(id: number) {
        return this.http.get<TareasObj>(`${this.urlBase}/posts/${id}`);
    }

    add(tarea: TareasObj): Observable<TareasObj> {
        return this.http.post<TareasObj>(this.urlBase, tarea);
    }
}
