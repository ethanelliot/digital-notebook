import { dialogRegistry } from "@/lib/dialogs";
import type DialogTypes from "@/types/dialog";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface DialogProviderProps {
  children: ReactNode;
}

interface DialogState {
  isOpen: boolean;
  dialogType: keyof DialogTypes | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dialogProps: any;
}

interface DialogContextType {
  state: DialogState;
  openDialog: <T extends keyof DialogTypes>(
    type: T,
    props: DialogTypes[T]
  ) => void;
  closeDialog: () => void;
  openConfirm: (props: DialogTypes["confirm"]) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: DialogProviderProps) {
  const [state, setState] = useState<DialogState>({
    isOpen: false,
    dialogType: null,
    dialogProps: null,
  });

  const openDialog = useCallback(
    <T extends keyof DialogTypes>(type: T, props: DialogTypes[T]) => {
      setState({
        isOpen: true,
        dialogType: type,
        dialogProps: props,
      });
    },
    []
  );

  const closeDialog = useCallback(() => {
    setState({
      isOpen: false,
      dialogType: null,
      dialogProps: null,
    });
  }, []);

  const openConfirm = useCallback(
    (props: DialogTypes["confirm"]) => {
      openDialog("confirm", props);
    },
    [openDialog]
  );

  const contextValue = useMemo(
    () => ({
      state,
      openDialog,
      closeDialog,
      openConfirm,
    }),
    [state, openDialog, closeDialog, openConfirm]
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      <DialogRenderer />
    </DialogContext.Provider>
  );
}

const DialogRenderer = () => {
  const { state } = useDialog();

  if (!state.isOpen || !state.dialogType) {
    return null;
  }

  const DialogComponent = dialogRegistry[state.dialogType];

  if (!DialogComponent) {
    console.error(`Dialog type "${state.dialogType}" not found in registry`);
    return null;
  }

  return <DialogComponent {...state.dialogProps} />;
};

// Custom hook to use the context
export function useDialog() {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDashboardContext must be used within a NotesProvider");
  }
  return context;
}
