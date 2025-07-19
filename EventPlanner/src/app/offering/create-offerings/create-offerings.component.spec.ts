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

  // Mock Service object that satisfies the Service interface
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
    fixedTime: true
  };

  beforeEach(async () => {
    mockServiceService = jasmine.createSpyObj('ServiceService', ['add']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserId', 'getAccountId']);
    mockCategoryService = jasmine.createSpyObj('CategoryService', ['getAll']);

    await TestBed.configureTestingModule({
      declarations: [CreateOfferingsComponent],
      imports: [
        // Core Angular modules
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule, // Required for Material components
        HttpClientTestingModule,
        
        // Angular Material modules (removed duplicates)
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

  it('should call serviceService.add() on valid submit', () => {
    mockServiceService.add.and.returnValue(of(mockService));

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

    component.onSubmit();

    expect(mockServiceService.add).toHaveBeenCalled();
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

  it('should submit when existing category is selected (createCategory = false)', () => {
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

    expect(mockServiceService.add).toHaveBeenCalled();
    const sentData = mockServiceService.add.calls.mostRecent().args[0];
    expect(sentData.categoryId).toBe(1);
    expect(sentData.categoryProposalName).toBeNull();
    expect(sentData.categoryProposalDescription).toBeNull();
  });

  it('should submit when new category is being created (createCategory = true)', () => {
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

    expect(mockServiceService.add).toHaveBeenCalled();
    const sentData = mockServiceService.add.calls.mostRecent().args[0];
    expect(sentData.categoryId).toBeNull();
    expect(sentData.categoryProposalName).toBe('New Category');
    expect(sentData.categoryProposalDescription).toBe('New Description');
  });

  it('should validate required fields correctly', () => {
    // Test praznih obaveznih polja
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

  it('should handle flexible time type correctly', () => {
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

    expect(mockServiceService.add).toHaveBeenCalled();
    const sentData = mockServiceService.add.calls.mostRecent().args[0];
    expect(sentData.minDuration).toBe(1);
    expect(sentData.maxDuration).toBe(4);
    expect(sentData.autoConfirm).toBeFalse();
  });

  it('should validate price and discount ranges', () => {
    // Test negativan price
    component.createForm.get('price')?.setValue(-10);
    expect(component.createForm.get('price')?.invalid).toBeTrue();

    // Test discount preko 100%
    component.createForm.get('discount')?.setValue(150);
    expect(component.createForm.get('discount')?.invalid).toBeTrue();

    // Test validne vrednosti
    component.createForm.get('price')?.setValue(50);
    component.createForm.get('discount')?.setValue(20);
    expect(component.createForm.get('price')?.valid).toBeTrue();
    expect(component.createForm.get('discount')?.valid).toBeTrue();
  });

  it('should properly construct CreateServiceDTO with all fields', () => {
    component.photoPaths = ['photo1.jpg', 'photo2.jpg'];
    
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

    const sentData = mockServiceService.add.calls.mostRecent().args[0];
    expect(sentData.name).toBe('Test Service');
    expect(sentData.description).toBe('Test Description');
    expect(sentData.specification).toBe('Test Spec');
    expect(sentData.price).toBe(150);
    expect(sentData.discount).toBe(15);
    expect(sentData.photos).toEqual(['photo1.jpg', 'photo2.jpg']);
    expect(sentData.maxDuration).toBe(2);
    expect(sentData.minDuration).toBe(2);
    expect(sentData.reservationPeriod).toBe(24);
    expect(sentData.cancellationPeriod).toBe(12);
    expect(sentData.isAvailable).toBeTrue();
    expect(sentData.isVisible).toBeTrue();
    expect(sentData.provider).toBe(123);
  });

  it('should show success message on successful service creation', () => {
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
  });

  it('should show error message on service creation failure', () => {
    spyOn(component.snackBar, 'open');
    mockServiceService.add.and.returnValue(throwError('Server error'));

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
  });

  it('should reset form after successful submission', () => {
    mockServiceService.add.and.returnValue(of(mockService));
    spyOn(component.createForm, 'reset');

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

    expect(component.createForm.reset).toHaveBeenCalled();
  });

  it('should toggle category creation validation correctly', () => {
    // Initially createCategory is false, serviceCategory should be required
    expect(component.createForm.get('serviceCategory')?.hasError('required')).toBeTrue();
    
    // Enable category creation
    component.createForm.get('createCategory')?.setValue(true);
    fixture.detectChanges();

    // Now categoryName and categoryDescription should be required
    component.createForm.get('categoryName')?.setValue('');
    component.createForm.get('categoryDescription')?.setValue('');
    component.createForm.get('categoryName')?.markAsTouched();
    component.createForm.get('categoryDescription')?.markAsTouched();
    
    expect(component.createForm.get('categoryName')?.hasError('required')).toBeTrue();
    expect(component.createForm.get('categoryDescription')?.hasError('required')).toBeTrue();
    expect(component.createForm.get('serviceCategory')?.hasError('required')).toBeFalse();
  });
});