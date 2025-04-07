import { Component, ViewChild } from '@angular/core';
import { Employee, EmployeeService } from '../../services/employee.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  //selector: 'app-employees',
  templateUrl: './employees.component.html',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule
  ],
  standalone: true,
})
export class EmployeesComponent {
  employeeId: number | null = null;

  displayedColumns: string[] = ['id', 'employee_Name', 'employee_Salary', 'employee_Annual_Salary'];
  dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeService,   private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  searchEmployee(): void {
    const obs$ = this.employeeId
      ? this.employeeService.getEmployeeById(this.employeeId).pipe(
          switchMap(employee => {
            if (!employee) {
              debugger
              this.showError('Employee not found.');
              return of([]);
            }
            return of([employee]);
          }),
          catchError((er) => {
            this.showError(er.error.message || 'Error fetching all employees.');
            return of([]);
          })
        )
      : this.employeeService.getAllEmployees().pipe(
          catchError((er) => {
            
            this.showError(er.error.message || 'Error fetching all employees.');
            return of([]);
          })
        );
  
    obs$.subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error']
    });
  }
  
}
