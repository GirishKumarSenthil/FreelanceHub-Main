
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FreelancerService } from '../../freelancer.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NotificationService } from '../../notification.service';

@Component({
  selector: 'app-edit-freelancer',
  templateUrl: './edit-freelancer.component.html',
  styleUrls: ['./edit-freelancer.component.css'],
  standalone:false
})
export class FreelancerEditComponent implements OnInit {

  freelancerForm!: FormGroup;
   skills: string[] = [];
   imagePreview: any;
defaultImage = 'assets/default-profile.png';
resumePreview: any;
isFile: boolean = false;
userId: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private freelancerService: FreelancerService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Fetch client details using userId from localStorage
     this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId') || localStorage.getItem('userId');
    if (this.userId) {
       this.freelancerService.getFreelancerDetails(this.userId).subscribe((freelancer) => {
      console.log(freelancer);
      this.freelancerForm.patchValue({
        ...freelancer,
        skills: freelancer.skillsAsList.join(','),
         FOW: freelancer.fow // Set skills as a string for the form control
      });
       this.skills = freelancer.skillsAsList || [];
     this.imagePreview = freelancer.profile_image;
        // ? `http://localhost:8080${freelancer.profile_image}`
        // : this.defaultImage;
      this.resumePreview = freelancer.resume;
        // ? `http://localhost:8080${freelancer.resume}`
        // : '';
      this.freelancerForm.get('profileImage')?.setValue(freelancer.profile_image);
      this.freelancerForm.get('resume')?.setValue(freelancer.resume);
      this.isFile = this.resumePreview instanceof File;
      });
    }
  });
    // Initialize form
  }

  initializeForm(): void {
    // Pre-fill the form with freelancer's existing data
    this.freelancerForm = this.fb.group({
      freeEmail: ['', [Validators.required, this.customEmailValidator()]],
      freeName: ['', Validators.required],
      freeAge: ['', [Validators.required, Validators.min(18)]],
      country: ['', Validators.required],
      FOW: ['', Validators.required],
      experience: ['', Validators.required],
      skills: ['', Validators.required],
      qualification: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/)]],
      retypePassword: ['', Validators.required],
      profileImage: [null],
      resume: [null],
    },{
      validators: [this.passwordMatchValidator]
    });
  }
  getResumeName(): string {
  if (typeof this.resumePreview === 'string') {
    return this.resumePreview; // Return the string (path from the database)
  } else if (this.resumePreview instanceof File) {
    return this.resumePreview.name; // Return the name of the uploaded file
  }
  return ''; // Default fallback
}

   onResumeUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
        alert("Please upload a PDF or DOC file.");
        return;
      }
      this.resumePreview = file;
      this.freelancerForm.get('resume')?.setValue(file);
    }
  }

  removeResume(): void {
    this.resumePreview = '';
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
  this.freelancerForm.get('resume')?.reset();
  }   

   customEmailValidator(): ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|in|edu|net)$/;
        const value = control.value;
        return value && !emailRegex.test(value) ? { invalidEmail: true } : null;
      };
    }

     passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const retypedPassword = control.get('retypePassword');

  
  if (password && retypedPassword && password.value !== retypedPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
};

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    this.freelancerForm.patchValue({ profileImage: file }); 
    this.freelancerForm.get('profileImage')?.updateValueAndValidity();


    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.imagePreview = this.defaultImage;
     const fileInput = document.getElementById('profile-upload') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
  this.freelancerForm.get('profileImage')?.reset();
  }

  

  onSkillInput(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement);
    if (event.key === 'Enter' && input.value.trim()) {
      event.preventDefault();
      this.skills.push(input.value.trim());
      input.value = ''; 
      this.freelancerForm.get('skills')?.setValue(this.skills.join(','));
    }
  }

  removeSkill(skill: string): void {
    this.skills = this.skills.filter(s => s !== skill);
   this.freelancerForm.get('skills')?.setValue(this.skills.join(','));
  }

   addSkill(skill?: string): void {
    const input = document.getElementById('skills-input') as HTMLInputElement;
    const skillToAdd = skill || input.value.trim(); 
    if (skillToAdd) {
        this.skills.push(skillToAdd);
        this.freelancerForm.get('skills')?.setValue(this.skills.join(','));
        if (!skill) input.value = ''; 
    }
}
  updateFreelancer(): void {
    this.freelancerForm.markAllAsTouched();
   console.log(this.freelancerForm.value);
   console.log(this.freelancerForm.valid);
   if (this.freelancerForm.valid) {
   
    if (this.userId) {

      const formData = new FormData();
      

    Object.keys(this.freelancerForm.value).forEach(key => {
      if (key !== 'profileImage' && key !=='resume' && key!=='freeId') {
        formData.append(key, this.freelancerForm.value[key]);
      }
    });


    const profileImage = this.freelancerForm.get('profileImage')?.value;
      if (profileImage instanceof File) {
        formData.append('profileImage', profileImage);
      }


      const resume = this.freelancerForm.get('resume')?.value;
      if (resume instanceof File) {
        formData.append('resume', resume);
      }
      formData.append('freeId', this.userId);  

      this.freelancerService.updateFreelancer(formData).subscribe(
        () => {
          if (localStorage.getItem('userId')) {
            this.router.navigate([`/profile/freelancer/${this.userId}`]);
            this.notificationService.showNotification('Profile edited successfully!', 'success');
          } else {
            this.notificationService.showNotification('Password reset successfully! Please log in.', 'success', '/login');
          }
        },
        error => {
          this.notificationService.showNotification(error, 'error');
        }
      );
    }
    else{
      alert('Userid not found');
    }
  }
  }
}


