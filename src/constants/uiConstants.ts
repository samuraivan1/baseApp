import { images } from '@/assets/images';
export const HOME_BACKGROUND_IMAGE = images.homeImg;
export const LOGIN_BACKGROUND_IMAGE = images.loginImg;

// Constant Parameters
export const MESSAGE_ERROR_CLAVE = 'El campo "Clave"';
export const MESSAGE_ERROR_VALOR = 'El campo "Valor"';

// Operaciones alta y edición Parámetros
export const TITULO_EDICION_PARAMETRO = 'Actualizaci\u00f3n de Par\u00e1metro';
export const TITULO_ALTA_PARAMETRO = 'Alta de Par\u00e1metro';

// Extensiones archivos descarga
export const XLSX_EXTENSION = `.xlsx`;
export const CSV_EXTENSION = `.csv`;

export const EXT_FORMAT_COMPLEMENT = {
  CSV: 'csv',
  TXT: 'txt',
};

export const LABEL_VALUE_NULL_ELEMENT = {
  label: '',
  value: null,
};

export const daysOfWeek = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
export const monthsOfYear = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

// ... (todas las demás constantes de UI del archivo original)
export const DEFAULT_ROWS_PER_PAGE = 5;
export const ITEMS_PER_PAGE_GROUP = 1000;
// Definicion tipo de celda
export const cellText = 'cellText';
export const cellCheckBox = 'cellCheck';
export const cellAction = 'cellAction';
// ... (y todas las demás constantes de tipo de celda)

// Definicion tipo de encabezado
export const headerCheckbox = 'check';
export const headerGear = 'headerGear';
// ... (y todas las demás constantes de tipo de encabezado)

// MlAlert
export const ALERT_ICON_SUCCESS = 'SuccessIcon';
export const ALERT_ICON_ERROR = 'ErrorIcon';
// ... (y todas las demás constantes de alertas)

export const DESCARGAR_COL_DEF = 'descargaArchivo';

export const INTL_DATETIMEFORMAT = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
  timeZone: 'America/Mexico_City',
};

export const ACCENTS_MAP = {
  '&Aacute;': 'À|Á|Ã|Â',
  '&aacute;': 'á|à|ã|â',
  '&Eacute;': 'É|È|Ê',
  '&eacute;': 'é|è|ê',
  // ... (y el resto del mapa de acentos)
};

//variables para la pantalla Usuarios
export const USER_KEY_ROL_ID = 'rolID';
export const PROMOTORIA_ROL_ID = '1002';
// ... (y las demás constantes de roles)

export const AVISO_PRIVACIDAD = 'https://www.truper.com/aviso-de-privacidad';
export const TRUPER_COM = 'https://www.truper.com.mx';
export const CONDICIONES_DE_USO =
  'https://www.truper.com/terminos-y-condiciones';

export const DEFAULT_DATE_FORMAT = 'yyyy/MM/dd';

// ... (todas las demás constantes del archivo original)
export const STATUS_CODE_NOT_FOUND = 404;

export const errorCatbacksByUser = {
  response: {
    status: STATUS_CODE_NOT_FOUND,
    data: {
      errors: null,
      process: 'Consulta de cat\u00E1logo',
      message: 'Error el usuario no tiene bancos configurados',
    },
  },
};
