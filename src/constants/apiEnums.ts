// Enums centralizados disponibles en '@/shared/types/enums' si se requieren.

export enum EDispersionStatus {
  Anulado = 'AN',
  DispersionCancel = 'CA',
  PendienteCancel = 'CP',
  DispersionError = 'DE',
  PendienteDispersion = 'PD',
  Dispersado = 'PR',
  TotalmenteDispersado = 'TD',
}

export enum ETransactionStatus {
  Enviado = 'ENV',
}

export const POLICY_VALIDATION_CONSTANTS = {
  primaryToken: '|@|',
  secondaryToken: '|$|',
  lengthValidation: 'Longitud inválida',
  validationError: 'Error de configuración',
} as const;

// Variables para la pantalla Usuarios
export const USER_KEY_ROL_ID = 'rolID' as const;
export const PROMOTORIA_ROL_ID = '1002' as const;
