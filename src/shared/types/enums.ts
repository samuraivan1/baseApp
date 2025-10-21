// Centralized enums with E<Name> prefix

/** Estados genéricos de activación. */
export enum EActiveFlag {
  Inactive = 0,
  Active = 1,
}

// TODO: migrate constants in src/constants/apiEnums.ts to enums below when applicable.
// Example placeholders (adjust to domain when moving):
export enum EFolioStatus {
  InProcess = '0',
  Authorized = '1',
  Error = '2',
  Deleted = '3',
  Pending = '99',
}

export { EFolioStatus as EFOLIO_STATUS };
