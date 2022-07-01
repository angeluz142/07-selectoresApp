import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesServiceService } from '../../services/paises-service.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  miFormulario: FormGroup = this.frmBuilder.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  // Llenar selectores
  regiones: string[] = [];
  paises:PaisSmall[] = [];
  // fronteras:string[] = [];
  fronteras:PaisSmall[] = [];

  constructor(
    private frmBuilder: FormBuilder,
    private paisesSrv: PaisesServiceService) {}

  ngOnInit(): void {
    this.regiones = this.paisesSrv.regiones;

    // Busqueda de paisese segun region
    // this.miFormulario.get('region')?.valueChanges.subscribe((region) => {
    //   console.log(region);

    //     this.paisesSrv.getPaisesPorRegion(region)
    //       .subscribe( countries => {
    //         console.log(countries);            
    //          this.paises = countries;
    //       } )

    //       this.miFormulario.get('pais')?.reset();

    // });

    // Refactorizando la funcion de arriba quedaría

    this.miFormulario.get('region')?.valueChanges
      .pipe(  
        tap( (_) => {
          this.miFormulario.get('pais')?.reset();
          this.miFormulario.get('fronteras')?.reset();
        }),      
        switchMap( region => this.paisesSrv.getPaisesPorRegion(region) )
      )
      .subscribe( paises => {
        // El switchMap lo transforma a paises
        console.log(paises);
        this.paises = paises;
      });

      this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( (_) => {
            this.miFormulario.get('fronteras')?.reset();
          }),  
          switchMap( codigo => this.paisesSrv.getFronterasPorPais(codigo)),
          switchMap( pais => this.paisesSrv.getPaisPorcodigo(pais?.borders!))
        )
           .subscribe( paises => {          
           this.fronteras = paises;           
            console.log(paises);
            

        } )
        
  }

  guardar() {
    console.log('');
  }
}
