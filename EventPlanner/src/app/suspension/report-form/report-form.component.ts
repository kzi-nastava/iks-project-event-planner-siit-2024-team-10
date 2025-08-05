import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreateAccountReportDTO } from '../model/create-account-report-dto.model';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent {
  form: FormGroup;
  reporterId: number;
  reporteeId: number

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReportFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { reporterId: number; reporteeId: number }
  ) {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void{
    this.reporteeId = this.data.reporteeId;
    this.reporterId = this.data.reporterId;
  }

  submit(): void {
    if (this.form.valid) {
      const result: CreateAccountReportDTO = {
        description: this.form.value.description,
        reporterId: this.reporterId,
        reporteeId: this.reporteeId
      };
      this.dialogRef.close(result);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
