export interface LinksType {
  reportGroupMasterId: number;
  guid: string;
  reportGroup: string;
}

export interface LinksDialogProps {
  links: any[];
  handleClose: () => void;
}
