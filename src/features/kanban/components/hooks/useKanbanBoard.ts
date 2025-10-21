import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// removed unused imports
import errorService, { normalizeError } from '@/shared/api/errorService';
import { fetchBoard, updateBoard } from '@/features/kanban';
import { apiCall } from '@/shared/api/apiCall';
import { useBoardStore } from '@/features/shell/state/boardStore';
import logger from '@/shared/api/logger';
import { kanbanLogContexts } from '../Kanban.messages';
import { TableroType } from '@/shared/types/ui';


export const useKanbanBoard = () => {
  const queryClient = useQueryClient();
  const setBoardState = useBoardStore((state) => state.setBoardState);

  const { data: serverBoardData, isLoading, isError } = useQuery<TableroType, Error>({
    queryKey: ['board'],
    queryFn: async () => {
      const res = await apiCall(() => fetchBoard(), { where: 'kanban.board.fetch', toastOnError: true });
      if (!res.ok) throw res.error as unknown as Error;
      return res.value;
    },
  });

  const boardMutation = useMutation<TableroType, Error, TableroType, { previousState?: TableroType }>({
    mutationFn: async (state: TableroType) => {
      const res = await apiCall(() => updateBoard(state), { where: 'kanban.board.save', toastOnError: true });
      if (!res.ok) throw res.error as unknown as Error;
      return res.value;
    },
    onMutate: async (newState: TableroType) => {
      await queryClient.cancelQueries({ queryKey: ['board'] });
      const previousState = queryClient.getQueryData<TableroType>(['board']);
      queryClient.setQueryData(['board'], newState);
      return { previousState };
    },
    onError: (err, _newState, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(['board'], context.previousState);
        setBoardState(context.previousState);
      }
      logger.error(err as Error, { context: kanbanLogContexts.boardSave });
      errorService.logError(normalizeError(err, { where: 'kanban:save' }));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
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
    updateBoard: boardMutation.mutate,
  };
};
