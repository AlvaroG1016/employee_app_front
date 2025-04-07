import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';

export interface Employee {
  id: number;
  employee_name: string;
  employee_salary: number;
  employee_age: number;
  profile_image: string;
  employee_annual_salary: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<any>(`${this.baseUrl}/GetAllEmployees`).pipe(
      map(response => {
        if (response?.result  && Array.isArray(response.data) && Array.isArray(response.data[0])) {
          return response.data[0] as Employee[];
        }
        throw new Error('Invalid response structure');
      })
    );
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<any>(`${this.baseUrl}/GetEmployeeById?Id=${id}`).pipe(
      map(response => {
        if (response?.result  && Array.isArray(response.data)) {
          return response.data[0] as Employee;
        }
        throw new Error('Invalid response structure');
      })
    );
  }
  
}
