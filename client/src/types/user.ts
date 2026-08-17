export type UserRole = 'admin' | 'dealer';

export interface ServiceCenter {
  name: string;
  address: string;
  contact: string;
  sealName: string;
}

/** Authenticated user shape returned by POST /api/auth/login */
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName: string;
  token: string;
}

/** Full profile shape returned by GET /api/profile (no token field) */
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName: string;
  dutyParagraph: string;
  businessRegNo: string;
  bankAccount: string;
  serviceCenter: ServiceCenter;
  createdAt: string;
  updatedAt: string;
}

/** GET /api/admin/dealers — dealer profile plus aggregated invoice stats */
export interface DealerWithStats extends UserProfile {
  invoiceCount: number;
  totalSubtotal: number;
}
