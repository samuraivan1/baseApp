// Tipos para el Tablero Kanban
export interface TareaType {
  idTarea: string;
  contenido: string;
  usuariosAsignados?: string[];
  fechaVencimiento?: string;
  diasActivo?: number;
}

export interface ColumnaType {
  idColumna: string;
  titulo: string;
  tareasIds: string[];
}

export interface TableroType {
  tareas: { [key: string]: TareaType };
  columnas: { [key: string]: ColumnaType };
  ordenColumnas: string[];
}

// Tipos para el Módulo de Seguridad
export interface UsuarioType {
  idUsuario: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  iniciales: string;
  correoElectronico: string;
  nombreUsuario: string;
  hashContrasena: string;
  rolId: number;
  status: 'activo' | 'inactivo';

  /*      "proveedorAuth": "local", 
      "correoVerificadoEn": "2025-01-15T10:00:00Z", 
      "urlAvatar": "https://example.com/avatars/ar.png", 
      "biografia": "Líder de proyecto con 5 años de experiencia en desarrollo ágil.", 
      "numeroTelefono": "+525512345678", 
      "rolId": 1, 
      "status": "activo", 
      "fechaCreacion": "2025-01-15T09:30:00Z", 
      "fechaActualizacion": "2025-08-20T11:00:00Z", 
      "ultimoInicioSesion": "2025-08-27T11:20:00Z", 
      "azureAdObjectId": "a1b2c3d4-e5f6-7890-1234-567890abcdef", 
      "upn": "iamendezm@empresa.onmicrosoft.com", 
      "id": "e1de" */

  // ... y otros campos del JSON que podrías necesitar en el futuro
}

export interface PermisoType {
  idPermiso: number;
  permiso: string;
  descripcion: string;
}

export interface RolType {
  idRol: number;
  nombre: string;
  descripcion: string;
  permisosIds: number[];
}

// Tipos para los Menús
export interface NavMenuItem {
  idMenu: number | string;
  titulo: string;
  ruta?: string;
  permisoId?: number | null;
  items?: NavMenuItem[];
}
