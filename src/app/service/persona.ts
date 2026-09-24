import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../models/Persona';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PersonaService {
    private urlBase = 'http://localhost:8081/personas';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Persona[]> {
        return this.http.get<Persona[]>(this.urlBase);
    }

    getById(id: number) {
        return this.http.get<Persona>(this.urlBase + '/' + id);
    }

    add(persona: Persona): Observable<Persona> {
        return this.http.post<Persona>(this.urlBase, persona);
    }
}
