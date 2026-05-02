export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

export interface HomeWithHost {
  id: string;
  title: string;
  description: string;
  location: string;
  maxGuests: number;
  amenities: string[];
  photos: string[];
  host: {
    id: string;
    name: string;
    profilePhoto: string | null;
  };
  availability: Array<{
    startDate: Date;
    endDate: Date;
  }>;
}

export interface BookingRequestWithDetails {
  id: string;
  startDate: Date;
  endDate: Date;
  guestCount: number;
  message: string | null;
  status: string;
  totalAmount: number | null;
  guest: {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    location: string | null;
    workInfo: string | null;
    socialMedia: string | null;
    profilePhoto: string | null;
  };
  home: {
    id: string;
    title: string;
    location: string;
  };
}