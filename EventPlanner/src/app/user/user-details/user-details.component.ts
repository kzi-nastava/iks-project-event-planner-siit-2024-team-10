import {Component, inject, OnInit} from '@angular/core';
import { AuthService } from '../../infrastructure/auth/auth.service';
import {UserService} from '../user.service';
import {GetUserDTO} from '../model/get-user-dto.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from '../../../env/environment';
import {CreateAgendaItemComponent} from '../../event/create-agenda-item/create-agenda-item.component';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import {Router} from '@angular/router';
import {ConfirmDialogComponent} from '../../layout/confirm-dialog/confirm-dialog.component';
import {UpdateProfilePhotoComponent} from '../update-profile-photo/update-profile-photo.component';
import {UpdateCompanyPhotosComponent} from '../update-company-photos/update-company-photos.component';
import { ImageService } from '../../offering/image-service/image.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  user:GetUserDTO;
  images:string[]=[];
  activeImage=0;

  snackBar:MatSnackBar = inject(MatSnackBar);

  constructor(private authService:AuthService,
              private userService: UserService,
              private imageService:ImageService,
              private dialog: MatDialog,
              private router: Router,){

  }

  ngOnInit() {
    this.userService.getUser(this.authService.getAccountId()).subscribe({
      next: (user:GetUserDTO) => {
        this.user=user;
        if(user.role=="PROVIDER")
          this.loadImages();
      },
      error: (err) => {
        this.snackBar.open('Error fetching account details','OK',{duration:5000});
      }
    });
  }

  getRole():string{
    if(this.user?.role=='EVENT_ORGANIZER')
      return "EVENT ORGANIZER";
    else
      return this.user?.role;
  }

  getProfilePhoto():string{
    if(this.user?.profilePhoto==null)
      return this.imageService.getImageUrl(undefined);
    else{
      return this.imageService.getImageUrl(this.user?.profilePhoto);
    }
  }

  hasPersonalDetails():boolean{
    return this.user?.role == "EVENT_ORGANIZER" || this.user?.role == "PROVIDER";
  }

  hasCompanyDetails():boolean{
    return this.user?.role == "PROVIDER";
  }

  loadImages():void{
    this.images = this.imageService.getImageUrls(this.images=this.user?.company?.photos);
  }

  setActiveImage(index: number): void {
    this.activeImage = index;
  }

  changePassword(){
    this.dialog.open(ChangePasswordComponent, {
      width: '400px',
    });
  }

  updateProfilePhoto(){
    const dialogRef = this.dialog.open(UpdateProfilePhotoComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.profilePhoto=result;
      }
    });
  }

  updateCompanyPhotos(){
    const dialogRef = this.dialog.open(UpdateCompanyPhotosComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user.company.photos=result;
        this.loadImages();
      }
    });
  }

  deactivateAccount(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data:{message:"Are you sure you want to deactivate your account?"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deactivateAccount(this.authService.getAccountId()).subscribe({
          next: () => {
            this.snackBar.open('Successfully deactivated!','OK',{duration:5000});
            localStorage.removeItem('user');
            this.authService.setUser();
            this.router.navigate(['/login'])
          },
          error: (err) => {
            this.snackBar.open(err.error, 'OK',{duration:5000});
          },
        });
      }
    });
  }
}
