import { CommonModule } from '@angular/common';
import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientsService } from '../services/patients.service';
import { PatientInfo } from '../models/patientinfo.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-details',
  standalone: true,
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  
})

export class UserDetailsComponent implements OnInit {

  userDetailsForm!: FormGroup;
  isDisabled: boolean = true;
  constructor(
    public dialogRef: MatDialogRef<UserDetailsComponent>, private formBuilder: FormBuilder, private patientService:PatientsService,private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(); // Call close method to close the dialog
  }
  onSubmit() {
    if (this.userDetailsForm && this.userDetailsForm.valid) {

      const formData = this.userDetailsForm.value;

      if (this.data.operation == 'Edit') {
 
        const patientDetails = this.mapForm(formData);
        this.patientService.updatePatient(patientDetails).subscribe(res => {
          if (res) {
            this.toastr.success('Patient Updated Successfully', 'Edit Patient');
            this.dialogRef.close(formData);
          }
        });
      }
      if (this.data.operation == 'Add') {
 
        const patientDetails = this.mapForm(formData);
        this.patientService.addPatient(patientDetails).subscribe(res => {
          if (res) {
            this.toastr.success('Patient Added Successfully', 'Add Patient');
            this.dialogRef.close(formData);
          }
        });
      }
      
    }
  }
  onDelete () {
    if (this.userDetailsForm && this.userDetailsForm.valid) {
      
      this.patientService.deletePatient(this.data.id).subscribe(res => {
        if (res) {
          this.toastr.success('Patient Deleted Successfully', 'Delete Patient');
          this.dialogRef.close();
        }
      });
      
    }
  }

  mapForm(formData:any) {
    let patient = new PatientInfo;
    patient.id = this.data.id;
    patient.firstName = formData.firstName;
    patient.lastName = formData.lastName;
    patient.city = formData.city;
    patient.active = formData.active === "true" ? true : false;

    return patient;
  }
  ngOnInit() {
    this.userDetailsForm = this.formBuilder.group({
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      city: [this.data.city, Validators.required],
      active: [this.data.active === true ? 'true' : 'false', Validators.required]
    });

    if (this.data.operation == 'Edit') this.isDisabled = false;
  }
}
