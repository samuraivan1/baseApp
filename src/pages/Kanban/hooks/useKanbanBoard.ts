// src/pages/Kanban/hooks/useKanbanBoard.ts
import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchBoard, updateBoard } from '@/services/api';
import { useBoardStore } from '@/store/boardStore';
import logger from '@/services/logger';
import { kanbanMessages, kanbanLogContexts } from '../Kanban.messages';
import { BoardType } from '@/services/api.types';

export const useKanbanBoard = () => {
  const queryClient = useQueryClient();
  const setBoardState = useBoardStore((state) => state.setBoardState);
  const isInitialLoad = useRef(true);

  // Hook para obtener los datos del tablero
  const {
    data: serverBoardData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['board'],
    queryFn: fetchBoard,
  });

  // Hook para actualizar el tablero (mutación optimista)
  const boardMutation = useMutation({
    mutationFn: updateBoard,
    onMutate: async (newBoardState: BoardType) => {
      await queryClient.cancelQueries({ queryKey: ['board'] });
      const previousBoardState = queryClient.getQueryData<BoardType>(['board']);
      queryClient.setQueryData(['board'], newBoardState);
      return { previousBoardState };
    },
    onError: (err, newBoardState, context) => {
      if (context?.previousBoardState) {
        const boardState = context.previousBoardState as BoardType;
        queryClient.setQueryData(['board'], boardState);
        setBoardState(boardState);
      }
      logger.error(err as Error, { context: kanbanLogContexts.boardSave });
      toast.error(kanbanMessages.saveError);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board'] });
    },
  });

  // Efecto para la carga inicial de datos en el store de Zustand
  useEffect(() => {
    if (serverBoardData && isInitialLoad.current) {
      setBoardState(serverBoardData);
      isInitialLoad.current = false;
    }
  }, [serverBoardData, setBoardState]);

  // Devuelve solo lo que el componente necesita: el estado y la función para mutar
  return {
    isLoading,
    isError,
    updateBoard: boardMutation.mutate,
  };
};
