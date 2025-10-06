import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchTablero, updateTablero } from '@/features/kanban';
import { useBoardStore } from '@/features/shell/state/boardStore';
import logger from '@/shared/api/logger';
import { kanbanMessages, kanbanLogContexts } from '../Kanban.messages';
import { TableroType } from '@/shared/types/ui'; // ✅

export const useKanbanBoard = () => {
  const queryClient = useQueryClient();
  const setBoardState = useBoardStore((state) => state.setBoardState);

  const {
    data: serverBoardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['tablero'], // ✅
    queryFn: fetchTablero, // ✅
  });

  const boardMutation = useMutation({
    mutationFn: updateTablero, // ✅
    onMutate: async (newState: TableroType) => {
      await queryClient.cancelQueries({ queryKey: ['tablero'] });
      const previousState = queryClient.getQueryData<TableroType>(['tablero']);
      queryClient.setQueryData(['tablero'], newState);
      return { previousState };
    },
    onError: (err, newState, context) => {
      if (context?.previousState) {
        queryClient.setQueryData(['tablero'], context.previousState);
        setBoardState(context.previousState);
      }
      logger.error(err as Error, { context: kanbanLogContexts.boardSave });
      toast.error(kanbanMessages.saveError);
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
