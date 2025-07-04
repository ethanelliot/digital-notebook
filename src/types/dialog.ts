export default interface DialogTypes {
  confirm: ConfirmDialogProps;
}

export type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
};
