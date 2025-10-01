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

