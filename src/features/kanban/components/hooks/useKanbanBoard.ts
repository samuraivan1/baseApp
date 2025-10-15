import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { mapAppErrorMessage } from '@/shared/utils/errorI18n';
import errorService, { normalizeError } from '@/shared/api/errorService';
import { fetchTablero, updateTablero } from '@/features/kanban';
import { useBoardStore } from '@/features/shell/state/boardStore';
import logger from '@/shared/api/logger';
import { kanbanLogContexts } from '../Kanban.messages';
import { TableroType } from '@/shared/types/ui';

type ApiTask = { idTarea: string; contenido: string; usuariosAsignados?: string[]; fechaVencimiento?: string; diasActivo?: number };
type ApiColumn = { idColumna: string; titulo: string; tareasIds: string[] };
type ApiBoard = { tareas: Record<string, ApiTask>; columnas: Record<string, ApiColumn>; ordenColumnas: string[] };

function adaptBoardFromApi(api: ApiBoard): TableroType {
  const tasks: TableroType['tasks'] = {};
  Object.values(api.tareas || {}).forEach((t) => {
    tasks[t.idTarea] = {
      id: t.idTarea,
      content: t.contenido,
      assignees: t.usuariosAsignados,
      dueDate: t.fechaVencimiento,
      activeDays: t.diasActivo,
    };
  });
  const columns: TableroType['columns'] = {};
  Object.values(api.columnas || {}).forEach((c) => {
    columns[c.idColumna] = {
      id: c.idColumna,
      title: c.titulo,
      taskIds: c.tareasIds || [],
    };
  });
  const columnOrder = Array.isArray(api.ordenColumnas) ? api.ordenColumnas.slice() : [];
  return { tasks, columns, columnOrder };
}

export const useKanbanBoard = () => {
  const queryClient = useQueryClient();
  const setBoardState = useBoardStore((state) => state.setBoardState);

  const { data: serverBoardData, isLoading, isError } = useQuery<TableroType, Error>({
    queryKey: ['tablero'],
    queryFn: async () => {
      try {
        const raw = (await fetchTablero()) as unknown as ApiBoard | TableroType;
        // Detectar y adaptar si llega en formato API (español)
        if ((raw as ApiBoard)?.ordenColumnas && (raw as ApiBoard)?.columnas) {
          return adaptBoardFromApi(raw as ApiBoard);
        }
        return raw as TableroType;
      } catch (err) {
        toast.error(mapAppErrorMessage(err));
        errorService.logError(normalizeError(err, { where: 'kanban:list' }));
        throw err;
      }
    },
  });

  const boardMutation = useMutation<TableroType, Error, TableroType, { previousState?: TableroType }>({
    mutationFn: updateTablero,
    onMutate: async (newState: TableroType) => {
      await queryClient.cancelQueries({ queryKey: ['tablero'] });
      const previousState = queryClient.getQueryData<TableroType>(['tablero']);
      queryClient.setQueryData(['tablero'], newState);
      return { previousState };
    },
    onError: (err, _newState, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(['tablero'], context.previousState);
        setBoardState(context.previousState);
      }
      logger.error(err as Error, { context: kanbanLogContexts.boardSave });
      toast.error(mapAppErrorMessage(err));
      errorService.logError(normalizeError(err, { where: 'kanban:save' }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tablero'] });
    },
  });

  useEffect(() => {
    if (serverBoardData) {
      setBoardState(serverBoardData);
    }
  }, [serverBoardData, setBoardState]);

  return {
    isLoading,
    isError,
    updateTablero: boardMutation.mutate,
  };
};
