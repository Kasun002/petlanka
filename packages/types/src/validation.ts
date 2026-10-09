/** Matches Sri Lanka NIC: 9 digits + V/X (old) or 12 digits (new). */
export const NIC_REGEX = /^(\d{9}[VXvx]|\d{12})$/;
export const NIC_REGEX_MESSAGE = 'NIC must be 9 digits + V/X or 12 digits';

/** Matches +94XXXXXXXXX — 9 digits after the country code. */
export const SL_PHONE_REGEX = /^\+94\d{9}$/;
export const SL_PHONE_REGEX_MESSAGE = 'Enter a valid Sri Lanka mobile number (+94XXXXXXXXX)';

/** Channel used to identify a client user for OTP flow. */
export type OtpIdentifierType = 'phone' | 'email';

/** Shape passed via React Router location.state from LoginPage to OtpVerifyPage. */
export interface OtpVerifyRouteState {
  identifier: string;
  type: OtpIdentifierType;
}
