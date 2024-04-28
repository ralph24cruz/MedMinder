import { Component, OnInit, ViewChild } from '@angular/core';
import { PatientsService } from './services/patients.service';
import { PatientInfo } from './models/patientinfo.model';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsComponent } from './user-details/user-details.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  displayedColumns: string[] = ['firstName', 'lastName', 'city' , 'active']; // Define column names
  dataSource = new MatTableDataSource<PatientInfo>([]); 

  // Pagination properties
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  title = 'medminder-frontend';
   patients: PatientInfo[]|undefined;
   form!: FormGroup;
  constructor(private patientService : PatientsService , public dialog:MatDialog, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getAllPatients();
    this.form = this.fb.group({
      searchString: [''],
      filterBy: ['firstName'], // Set default value for filterBy
      sortBy: ['firstName'] // Set default value for sortBy
    });
  }

  getAllPatients(){
    this.patientService.getAllPatients().subscribe(data => {
      if (data) {
        this.dataSource.data = data;
        this.patients = data;
      this.dataSource.paginator = this.paginator;
      }
    });
  }
  onRowClicked(patient: PatientInfo) {
    console.log('Row clicked:', patient);
    // Perform any other actions you want when a row is clicked
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      hasBackdrop: true,
      backdropClass: '',
      width: '400px',
      position: {
        left: 'calc(50vw - 200px)'
      },
      data: { id: patient.id, firstName: patient.firstName, lastName: patient.lastName, city: patient.city, active: patient.active, operation: 'Edit' }
      
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllPatients();
    });
  }

  Add() {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      width: '400px',
      position: {
        left: 'calc(50vw - 200px)'
      },
      data: { operation: 'Add' }
      
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAllPatients();
    });
  }

  Search() {
    const formValue = this.form.value;
    this.patientService.getPaged(formValue).subscribe(data => {
      if (data) {
        this.dataSource.data = data;
        this.patients = data;
      this.dataSource.paginator = this.paginator;
      }
    });
  }
}


