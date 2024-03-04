import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../service/productos.service';
import { ActivatedRoute } from '@angular/router';
import { DateUtilitiesService } from '../../service/date-utilities.service'; // Servicio de utilidades de fecha
import { FormValidatorService } from '../../service/form-validator.service'; // Servicio de validación

@Component({
  selector: 'app-formulario-producto',
  templateUrl: './formulario-producto.component.html',
  styleUrls: ['./formulario-producto.component.css'],
})
export class FormularioProductoComponent implements OnInit {
  reset = true;
  forms: FormGroup;
  idParams: string;
  dataReceived: any;
  showModal = false;
  sectionModal = '';

  constructor(
    private fb: FormBuilder,
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private dateUtils: DateUtilitiesService,
    private formValidator: FormValidatorService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.idParams = params.get('id');
      this.initializeForm();
    });
  }

  private initializeForm() {
    const initialState = this.getInitialFormState();
    this.forms = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: [
        null,
        [Validators.required, this.formValidator.currentDateValidator],
      ],
      date_revision: [
        null,
        [
          Validators.required,
          this.formValidator.dateRevisionValidator.bind(this.forms),
        ],
      ],
    });
    if (initialState) {
      this.forms.patchValue(initialState);
    }
  }

  private getInitialFormState() {
    const dataReceived = history.state?.datos;
    if (dataReceived && this.idParams === 'editar') {
      return {
        id: dataReceived.data.id,
        name: dataReceived.data.name,
        description: dataReceived.data.description,
        logo: dataReceived.data.logo,
        date_release: this.dateUtils.convertDate(
          dataReceived.data.date_release
        ),
        date_revision: this.dateUtils.convertDate(
          dataReceived.data.date_revision
        ),
      };
    }
    return null;
  }

  resetForms() {
    this.forms.reset();
  }

  sendForms() {
    if (this.forms.valid) {
      const formData = {
        ...this.forms.value,
        date_release: this.dateUtils.toISOString(this.forms.value.date_release),
        date_revision: this.dateUtils.toISOString(
          this.forms.value.date_revision
        ),
      };

      const action =
        this.idParams === 'editar'
          ? this.productosService.updateProduct(formData)
          : this.productosService.addProduct(formData);

      action.subscribe(
        (response) => {
          this.handleResponse('REGISTRO GUARDADO');
          if (this.idParams !== 'editar') this.resetForms();
        },
        (error) => this.handleResponse('REGISTRO NO GUARDADO')
      );
    } else {
      this.handleResponse('REVISE LOS CAMPOS PORQUE NO CUMPLEN');
    }
  }

  private handleResponse(message: string) {
    this.showModal = true;
    this.sectionModal = message;
  }

  buttonAccepts(event: any): void {
    this.showModal = false;
  }
}
