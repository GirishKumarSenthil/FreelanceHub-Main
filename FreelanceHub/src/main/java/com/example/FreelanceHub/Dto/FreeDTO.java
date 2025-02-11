package com.example.FreelanceHub.Dto;

import jakarta.annotation.Nullable;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class FreeDTO {

	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	private String freeEmail;

	@NotBlank(message = "Name is required")
	@Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
	private String freeName;

	@NotNull(message = "Age is required")
	private Integer freeAge;

	@NotBlank(message = "Country is required")
	private String Country;

	@NotBlank(message = "Field of Work is required")
	private String FOW;

	@NotNull(message = "Experience is required")
	private Integer Experience;

	@NotBlank(message = "Qualification is required")
	private String Qualification;

	@NotBlank(message = "Skills are required")
	private String Skills;

	@NotBlank(message = "Password is required")
	@Size(min = 6, message = "Password must be at least 8 characters long")
	@Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$", message = "Password must contain at least one uppercase letter, one number, and one special character")
	private String password;

	private String rePassword;

	@AssertTrue(message = "You must agree to the terms and conditions")
	private Boolean termsAndConditions;

	@PrePersist
	@PreUpdate
	public void validatePasswordMatch() {
		if (!password.equals(rePassword)) {
			throw new IllegalArgumentException("Passwords do not match");
		}
	}


	private MultipartFile profileImage;

	public String getRePassword() {
		return rePassword;
	}

	public void setRePassword(String rePassword) {
		this.rePassword = rePassword;
	}

	public Boolean getTermsAndConditions() {
		return termsAndConditions;
	}

	public void setTermsAndConditions(Boolean termsAndConditions) {
		this.termsAndConditions = termsAndConditions;
	}

	public String getFreeEmail() {
		return freeEmail;
	}

	public void setFreeEmail(String freeEmail) {
		this.freeEmail = freeEmail;
	}

	public String getFreeName() {
		return freeName;
	}

	public void setFreeName(String freeName) {
		this.freeName = freeName;
	}

	public Integer getFreeAge() {
		return freeAge;
	}

	public void setFreeAge(Integer freeAge) {
		this.freeAge = freeAge;
	}

	public String getCountry() {
		return Country;
	}

	public void setCountry(String country) {
		Country = country;
	}

	public String getFOW() {
		return FOW;
	}

	public void setFOW(String fOW) {
		FOW = fOW;
	}

	public Integer getExperience() {
		return Experience;
	}

	public void setExperience(Integer experience) {
		Experience = experience;
	}

	public String getQualification() {
		return Qualification;
	}

	public void setQualification(String qualification) {
		Qualification = qualification;
	}

	public String getSkills() {
		return Skills;
	}

	public void setSkills(String skills) {
		Skills = skills;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public MultipartFile getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(MultipartFile profileImage) {
		this.profileImage = profileImage;
	}


	public String resumeUrl;

	public String getResumeUrl() {
		return resumeUrl;
	}

	public void setResumeUrl(String resumeUrl) {
		this.resumeUrl = resumeUrl;
	}

	private String freeId;

	public String getFreeId() {
		return freeId;
	}

	public void setFreeId(String freeId) {
		this.freeId = freeId;
	}

	// Getters and Setters

}