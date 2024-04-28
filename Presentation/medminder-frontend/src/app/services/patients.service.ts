import { Injectable } from '@angular/core';
import { PatientInfo } from '../models/patientinfo.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { searchCriteria } from '../models/searchCriteria.model';
@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  baseUrl = 'https://localhost:44373/api/';
  
  constructor(private http: HttpClient) { }

  getAllPatients() : Observable<PatientInfo[]> {
    return this.http.get<PatientInfo[]>(this.baseUrl + 'patients/getallpatients')
  }

  updatePatient(patientinfo: PatientInfo): Observable<PatientInfo> {
    return this.http.post<PatientInfo>(this.baseUrl + 'patients/updatepatient' , patientinfo)
  }
  addPatient(patientinfo: PatientInfo): Observable<PatientInfo> {
    return this.http.post<PatientInfo>(this.baseUrl + 'patients/addpatient' , patientinfo)
  }
  deletePatient(id: number): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'patients/deletepatient' , id)
  }
  getPaged (searchCriteria: searchCriteria) : Observable<PatientInfo[]> {
    return this.http.post<PatientInfo[]>(this.baseUrl + 'patients/getpaged' , searchCriteria)
  }
}
