export interface MdbWysiwygToolbarOptions {
  styles?: {
    disabled?: boolean;
    hidden?: boolean;
    p?: { disabled?: boolean; hidden?: boolean };
    h1?: { disabled?: boolean; hidden?: boolean };
    h2?: { disabled?: boolean; hidden?: boolean };
    h3?: { disabled?: boolean; hidden?: boolean };
    h4?: { disabled?: boolean; hidden?: boolean };
    h5?: { disabled?: boolean; hidden?: boolean };
    h6?: { disabled?: boolean; hidden?: boolean };
    pre?: { disabled?: boolean; hidden?: boolean };
  };
  formatting?: {
    disabled?: boolean;
    hidden?: boolean;
    bold?: { disabled?: boolean; hidden?: boolean };
    italic?: { disabled?: boolean; hidden?: boolean };
    underline?: { disabled?: boolean; hidden?: boolean };
    strikethrough?: { disabled?: boolean; hidden?: boolean };
    textColor?: { disabled?: boolean; hidden?: boolean };
    textBackground?: { disabled?: boolean; hidden?: boolean };
  };
  align?: {
    disabled?: boolean;
    hidden?: boolean;
    justifyLeft?: { disabled?: boolean; hidden?: boolean };
    justifyCenter?: { disabled?: boolean; hidden?: boolean };
    justifyRight?: { disabled?: boolean; hidden?: boolean };
    justifyFull?: { disabled?: boolean; hidden?: boolean };
  };
  lists?: {
    disabled?: boolean;
    hidden?: boolean;
    insertUnorderedList?: { disabled?: boolean; hidden?: boolean };
    insertOrderedList?: { disabled?: boolean; hidden?: boolean };
    indent?: { disabled?: boolean; hidden?: boolean };
    outdent?: { disabled?: boolean; hidden?: boolean };
  };
  links?: {
    disabled?: boolean;
    hidden?: boolean;
    link?: { disabled?: boolean; hidden?: boolean };
    image?: { disabled?: boolean; hidden?: boolean };
    insertHorizontalRule?: { disabled?: boolean; hidden?: boolean };
  };
  showCode?: { disabled?: boolean; hidden?: boolean };
  undoRedo?: {
    disabled?: boolean;
    hidden?: boolean;
    undo?: { disabled?: boolean; hidden?: boolean };
    redo?: { disabled?: boolean; hidden?: boolean };
  };
}
