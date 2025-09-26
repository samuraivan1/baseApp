// Define cómo debe ser una columna para que podamos filtrar por ella
export interface FilterableColumn {
  key: string; // El identificador interno (ej: "nombre", "descripcion")
  label: string; // El texto que verá el usuario (ej: "Nombre de Rol")
}

// Define la estructura de un solo filtro
export interface Filter {
  id: string; // Un ID único para la fila del filtro
  field: string; // La 'key' de la columna seleccionada
  value: string; // El valor que el usuario escribe para filtrar
}