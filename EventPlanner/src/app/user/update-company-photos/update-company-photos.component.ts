import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';
import {FileService} from '../../infrastructure/file/file.service';
import {UserService} from '../user.service';
import {AuthService} from '../../infrastructure/auth/auth.service';
import {UpdatedProfilePhotoDTO} from '../model/updated-profile-photo-dto.model';
import {UpdatedCompanyPhotosDTO} from '../model/updated-company-photos-dto.model';

@Component({
  selector: 'app-update-company-photos',
  templateUrl: './update-company-photos.component.html',
  styleUrl: './update-company-photos.component.css'
})
export class UpdateCompanyPhotosComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  photoForm: FormGroup;
  photoPaths: string[];
  snackBar: MatSnackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateCompanyPhotosComponent>,
    private fileService: FileService,
    private userService: UserService,
    private authService:AuthService,
  ) {
    this.photoForm = this.fb.group({
      photo: [null]
    });
  }

  onPhotoUpload() {
    const files = this.fileInput.nativeElement.files;
    if (files.length > 0) {
      this.uploadFiles(files);
    }
  }

  uploadFiles(files: FileList) {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    this.fileService.uploadPhotos(formData).subscribe({
      next: (response: string[]) => {
        this.snackBar.open('Files uploaded successfully', 'OK', { duration: 3000 });
        this.photoPaths = response;
      },
      error: (error) => {
        this.snackBar.open('Failed to upload files', 'Dismiss', { duration: 3000 });
      }
    });
  }

  onSave(): void {
    if (this.photoPaths) {
      this.userService.updateCompanyPhotos(this.authService.getAccountId(),{filePaths:this.photoPaths}).subscribe({
        next: (response: UpdatedCompanyPhotosDTO) => {
          this.snackBar.open('Company photos updated successfully', 'OK', { duration: 3000 });
          this.photoPaths = response.filePaths;
          this.dialogRef.close(this.photoPaths);
        },
        error: (error) => {
          this.snackBar.open('Failed to update company photos', 'Dismiss', { duration: 3000 });
          this.dialogRef.close(null);
        }
      });
    } else {
      this.snackBar.open('No photo selected', 'Dismiss', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}
