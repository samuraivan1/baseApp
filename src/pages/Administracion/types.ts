export type Usuario = {
  idUsuario: number;
  id?: string;
  nombre: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  iniciales?: string;
  correoElectronico?: string;
  nombreUsuario?: string;
  hashContrasena?: string;
  proveedorAuth?: string;
  correoVerificadoEn?: string | null;
  urlAvatar?: string | null;
  biografia?: string | null;
  numeroTelefono?: string | null;
  rolId?: number;
  status?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  ultimoInicioSesion?: string;
  azureAdObjectId?: string | null;
  upn?: string | null;
};

export type Rol = {
  idRol: number;
  nombre: string;
  descripcion?: string;
  permisosIds?: number[];
};

export type Permiso = {
  idPermiso: number;
  permiso?: string;
  resource?: string;
  scope?: string;
  action?: string;
  descripcion?: string;
};
