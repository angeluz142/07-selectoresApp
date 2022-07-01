import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesServiceService {

  private _baseUrl:string = 'https://restcountries.com/v2/';

  private _regiones:string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  constructor(private httpCli:HttpClient) { }

  get regiones():string[]{
    return [...this._regiones];
  }

  getPaisesPorRegion(region:string): Observable<PaisSmall[]> {
    const url:string = `${this._baseUrl}region/${region}?fields=name,alpha3Code`
    return this.httpCli.get<PaisSmall[]>(url);
  }

  getFronterasPorPais(pais:string): Observable<Pais | null>  {

    if(!pais)
      return of(null);
      
    const url:string = `${this._baseUrl}alpha/${pais}`;    
    return this.httpCli.get<Pais>(url);
  }

  getPaisPorCodigoSmall(codigo:string): Observable<PaisSmall>  {
    const url:string = `${this._baseUrl}alpha/${codigo}?fields=name,alpha3Code`;    
    return this.httpCli.get<PaisSmall>(url);
  }

  getPaisPorcodigo(fronteras:string[]):Observable<PaisSmall[]> {
    if(!fronteras)
      return of([]);

      const peticiones:Observable<PaisSmall>[] =[] ;

      fronteras.forEach(codigo =>{
        const peticion = this.getPaisPorCodigoSmall(codigo);
        peticiones.push(peticion);
      });

      return combineLatest(peticiones);

  }

}
