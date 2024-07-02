export interface TreeNodeDto {
  id?: string | null;
  parentId?: string | null;
  children?: TreeNodeDto[] | null;
}
