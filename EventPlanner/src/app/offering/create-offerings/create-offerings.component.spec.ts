import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOfferingsComponent } from './create-offerings.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ServiceService } from '../service-service/service.service';
import { AuthService } from '../../infrastructure/auth/auth.service';
import { CategoryService } from '../../offering/category-service/category.service';
import { Service } from '../model/service.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

describe('CreateOfferingsComponent', () => {
  let component: CreateOfferingsComponent;
  let fixture: ComponentFixture<CreateOfferingsComponent>;
  let mockServiceService: jasmine.SpyObj<ServiceService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockCategoryService: jasmine.SpyObj<CategoryService>;

  const mockService: Service = {
    id: 1,
    name: 'Test Service',
    category: { id: 1, name: 'Test Category', description: 'Test', deleted: false, pending: false, creatorId: 0 },
    description: 'Test Description',
    discount: 0,
    photos: [],
    provider: { id: 1, phoneNumber:"", firstName:"", lastName:"",location: null, company:null, accountId: 0, email: 'test@example.com' },
    location: { id: 1, city: 'Test City', country: 'Test Country', street: 'Test Street', houseNumber: '1'},
    price: 100,
    specification: 'Test Specification',
    averageRating: '5.0',
    eventTypes: [],
    available: true,
    visible: true,
    isProduct: false,
    deleted: false,
    comments: [],
    minDuration: 1,
    maxDuration: 2,
    cancellationPeriod: 24,
    reservationPeriod: 48,
    autoConfirm: true,
    fixedTime: true,
    pending: false,
  };

  beforeEach(async () => {
    mockServiceService = jasmine.createSpyObj('ServiceService', ['add']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId', 'getAccountId']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getAll']);

    await TestBed.configureTestingModule({
      declarations: [CreateOfferingsComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule, 
        HttpClientTestingModule,
        
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatIconModule
      ],
      providers: [
        { provide: ServiceService, useValue: mockServiceService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: CategoryService, useValue: mockCategoryService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOfferingsComponent);
    component = fixture.componentInstance;

    mockAuthService.getUserId.and.returnValue(123);
    mockAuthService.getAccountId.and.returnValue(456);
    mockCategoryService.getAll.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.createForm.valid).toBeFalse();
  });

  it('form should be valid when filled properly', () => {
    component.createForm.patchValue({
      name: 'Service name',
      description: 'Description',
      price: 100,
      discount: 10,
      serviceCategory: { id: 1, name: 'Test Category' },
      timeType: 'fixed',
      fixedTime: 2,
      reservationDeadline: 1,
      cancellationDeadline: 1,
      isAvailable: true,
      isVisible: true
    });

    expect(component.createForm.valid).toBeTrue();
  });

  it('should call serviceService.add() with exact CreateServiceDTO structure', () => {
    mockServiceService.add.and.returnValue(of(mockService));

    component.createForm.patchValue({
      createCategory: false,
      serviceCategory: { id: 1, name: 'Test Category' },
      name: 'Service name',
      description: 'Description',
      specification: 'Test spec',
      price: 100,
      discount: 10,
      timeType: 'fixed',
      fixedTime: 2,
      reservationDeadline: 1,
      cancellationDeadline: 1,
      isAvailable: true,
      isVisible: true
    });

    component.onSubmit();

    expect(mockServiceService.add).toHaveBeenCalledWith({
      categoryId: 1,
      pending: false,
      provider: 123, // From mock auth service
      name: 'Service name',
      description: 'Description',
      specification: 'Test spec',
      price: 100,
      discount: 10,
      photos: [], // Assuming empty array initially
      isVisible: true,
      isAvailable: true,
      maxDuration: 2,
      minDuration: 2,
      cancellationPeriod: 1,
      reservationPeriod: 1,
      autoConfirm: true,
      categoryProposalName: null,
      categoryProposalDescription: null,
      creatorId: null // Based on the actual component behavior
    });
  });

  it('should not call serviceService.add() if form is invalid', () => {
    component.createForm.patchValue({
      name: '',
      description: '',
      price: ''
    });

    component.onSubmit();

    expect(mockServiceService.add).not.toHaveBeenCalled();
  });

  it('should submit with null category fields when existing category is selected', () => {
    component.createForm.patchValue({
      createCategory: false,
      name: 'Service name',
      description: 'Description',
      price: 100,
      discount: 5,
      serviceCategory: { id: 1, name: 'Test Category' },
      timeType: 'fixed',
      fixedTime: 2,
      reservationDeadline: 1,
      cancellationDeadline: 1,
      isAvailable: true,
      isVisible: true
    });

    mockServiceService.add.and.returnValue(of(mockService));

    component.onSubmit();

    expect(mockServiceService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        categoryId: 1,
        categoryProposalName: null,
        categoryProposalDescription: null
      })
    );
  });

  it('should submit with category proposal when new category is being created', () => {
    component.createForm.patchValue({
      createCategory: true,
      categoryName: 'New Category',
      categoryDescription: 'New Description',
      name: 'Service name',
      description: 'Description',
      price: 200,
      discount: 10,
      timeType: 'fixed',
      fixedTime: 3,
      reservationDeadline: 2,
      cancellationDeadline: 2,
      isAvailable: false,
      isVisible: false
    });

    mockServiceService.add.and.returnValue(of(mockService));

    component.onSubmit();

    expect(mockServiceService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        categoryId: null,
        categoryProposalName: 'New Category',
        categoryProposalDescription: 'New Description'
      })
    );
  });

    it('should set pending to true when new category is proposed', () => {
    component.createForm.patchValue({
      createCategory: true,
      categoryName: 'New Cat',
      categoryDescription: 'Desc',
      name: 'New service',
      description: 'Desc',
      price: 200,
      timeType: 'fixed',
      fixedTime: 1,
      reservationDeadline: 2,
      cancellationDeadline: 2,
      isAvailable: true,
      isVisible: true
    });

    mockServiceService.add.and.returnValue(of(mockService));
    component.onSubmit();

    expect(mockServiceService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        pending: true
      })
    );
  });

  it('should validate required fields correctly', () => {
    component.createForm.patchValue({
      name: '',
      description: '',
      price: null,
      serviceCategory: null
    });

    expect(component.createForm.get('name')?.invalid).toBeTrue();
    expect(component.createForm.get('description')?.invalid).toBeTrue();
    expect(component.createForm.get('price')?.invalid).toBeTrue();
    expect(component.createForm.get('serviceCategory')?.invalid).toBeTrue();
  });

  it('should handle flexible time type with correct autoConfirm setting', () => {
    component.createForm.patchValue({
      name: 'Service name',
      description: 'Description',
      price: 100,
      serviceCategory: { id: 1, name: 'Test Category' },
      timeType: 'flexible',
      minTime: 1,
      maxTime: 4,
      reservationDeadline: 1,
      cancellationDeadline: 1,
      isAvailable: true,
      isVisible: true
    });

    mockServiceService.add.and.returnValue(of(mockService));

    component.onSubmit();

    expect(mockServiceService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        minDuration: 1,
        maxDuration: 4,
        autoConfirm: false 
      })
    );
  });

  it('should validate price and discount ranges', () => {
    component.createForm.get('price')?.setValue(-10);
    expect(component.createForm.get('price')?.invalid).toBeTrue();

    component.createForm.get('discount')?.setValue(150);
    expect(component.createForm.get('discount')?.invalid).toBeTrue();

    component.createForm.get('price')?.setValue(50);
    component.createForm.get('discount')?.setValue(20);
    expect(component.createForm.get('price')?.valid).toBeTrue();
    expect(component.createForm.get('discount')?.valid).toBeTrue();
  });

  it('should include photos in service creation request', () => {
    const testPhotos = ['photo1.jpg', 'photo2.jpg'];
    component.photoPaths = testPhotos;
    
    component.createForm.patchValue({
      createCategory: false,
      serviceCategory: { id: 5, name: 'Test Category' },
      name: 'Test Service',
      description: 'Test Description',
      specification: 'Test Spec',
      price: 150,
      discount: 15,
      timeType: 'fixed',
      fixedTime: 2,
      reservationDeadline: 24,
      cancellationDeadline: 12,
      isAvailable: true,
      isVisible: true
    });

    mockServiceService.add.and.returnValue(of(mockService));

    component.onSubmit();

    expect(mockServiceService.add).toHaveBeenCalledWith(
      jasmine.objectContaining({
        photos: testPhotos,
        provider: 123 // mockAuthService.getUserId()
      })
    );
  });

  it('should show success message', () => {
    spyOn(component.snackBar, 'open');
    mockServiceService.add.and.returnValue(of(mockService));

    component.createForm.patchValue({
      name: 'Service name',
      description: 'Description',
      price: 100,
      serviceCategory: { id: 1, name: 'Test Category' },
      timeType: 'fixed',
      fixedTime: 2,
      reservationDeadline: 1,
      cancellationDeadline: 1,
      isAvailable: true,
      isVisible: true
    });

    component.onSubmit();

    expect(component.snackBar.open).toHaveBeenCalledWith(
      'Service created successfully', 
      'OK', 
      { duration: 3000 }
    );
    
    // verify it was called exactly once
    expect(component.snackBar.open).toHaveBeenCalledTimes(1);
  });

  it('should show error message', () => {
    spyOn(component.snackBar, 'open');
    const errorMessage = 'Server error';
    mockServiceService.add.and.returnValue(throwError(errorMessage));

    component.createForm.patchValue({
      name: 'Service name',
      description: 'Description',
      price: 100,
      serviceCategory: { id: 1, name: 'Test Category' },
      timeType: 'fixed',
      fixedTime: 2,
      reservationDeadline: 1,
      cancellationDeadline: 1,
      isAvailable: true,
      isVisible: true
    });

    component.onSubmit();

    expect(component.snackBar.open).toHaveBeenCalledWith(
      'Failed to create service. Please try again.', 
      'Dismiss', 
      { duration: 3000 }
    );
    
    expect(component.snackBar.open).toHaveBeenCalledTimes(1);
  });

  it('should toggle category creation validation correctly', () => {
    // initially createCategory is false, serviceCategory should be required
    expect(component.createForm.get('serviceCategory')?.hasError('required')).toBeTrue();
    
    // enable category creation
    component.createForm.get('createCategory')?.setValue(true);
    fixture.detectChanges();

    // now categoryName and categoryDescription should be required
    component.createForm.get('categoryName')?.setValue('');
    component.createForm.get('categoryDescription')?.setValue('');
    component.createForm.get('categoryName')?.markAsTouched();
    component.createForm.get('categoryDescription')?.markAsTouched();
    
    expect(component.createForm.get('categoryName')?.hasError('required')).toBeTrue();
    expect(component.createForm.get('categoryDescription')?.hasError('required')).toBeTrue();
    expect(component.createForm.get('serviceCategory')?.hasError('required')).toBeFalse();
  });
    it('should show time range error message on submit', () => {
    spyOn(component.snackBar, 'open');

    component.createForm.patchValue({
      name: 'Service name',
      description: 'Description',
      price: 100,
      serviceCategory: { id: 1, name: 'Test Category' },
      timeType: 'flexible',
      minTime: 4,
      maxTime: 2,
      reservationDeadline: 1,
      cancellationDeadline: 1,
      isAvailable: true,
      isVisible: true
    });

    component.onSubmit();

    expect(mockServiceService.add).not.toHaveBeenCalled();
    expect(component.snackBar.open).toHaveBeenCalledWith(
      'Min cannot be higher than max',
      'Dismiss',
      { duration: 4000 }
    );
  });
});