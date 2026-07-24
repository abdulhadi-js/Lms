export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  WITHDRAWN = 'WITHDRAWN',
  REJECTED = 'REJECTED',
}

export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  DROPPED = 'DROPPED',
  COMPLETED = 'COMPLETED',
  DROP_REQUESTED = 'DROP_REQUESTED',
}

export enum ApplicationStatus {
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
}

export enum FeeStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  REFUNDED = 'REFUNDED',
}

export enum ContentType {
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  SCORM = 'SCORM',
  H5P = 'H5P',
}
