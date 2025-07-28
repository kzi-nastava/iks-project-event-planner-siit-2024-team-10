import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {environment} from '../../../env/environment';
import {FileService} from '../../infrastructure/file/file.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../user.service';
import {UpdatedProfilePhotoDTO} from '../model/updated-profile-photo-dto.model';
import {AuthService} from '../../infrastructure/auth/auth.service';

@Component({
  selector: 'app-update-profile-photo',
  templateUrl: './update-profile-photo.component.html',
  styleUrl: './update-profile-photo.component.css'
})
export class UpdateProfilePhotoComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  photoForm: FormGroup;
  photoPath: string;
  snackBar: MatSnackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateProfilePhotoComponent>,
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
    formData.append('files', files[0]);


    this.fileService.uploadPhotos(formData).subscribe({
      next: (response: string[]) => {
        this.snackBar.open('Files uploaded successfully', 'OK', { duration: 3000 });
        this.photoPath = response[0];
      },
      error: (error) => {
        this.snackBar.open('Failed to upload files', 'Dismiss', { duration: 3000 });
      }
    });
  }

  onSave(): void {
    if (this.photoPath) {
      this.userService.updateProfilePhoto(this.authService.getAccountId(),{filePath:this.photoPath}).subscribe({
        next: (response: UpdatedProfilePhotoDTO) => {
          this.snackBar.open('Profile photo updated successfully', 'OK', { duration: 3000 });
          this.photoPath = response.filePath;
          this.dialogRef.close(this.photoPath);
        },
        error: (error) => {
          this.snackBar.open('Failed to update profile photo', 'Dismiss', { duration: 3000 });
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
