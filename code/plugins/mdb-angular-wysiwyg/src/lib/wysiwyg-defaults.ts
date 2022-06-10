import { MdbWysiwygOptions } from './wysiwyg-options.interface';
import { MdbWysiwygToolbarOptions } from './wysiwyg-toolbar-options.interface';

export const OPTIONS_ITEMS: MdbWysiwygOptions = {
  paragraph: 'Paragraph',
  textStyle: 'Text style',
  heading: 'Heading',
  preformatted: 'Preformatted',
  bold: 'Bold',
  italic: 'Italic',
  strikethrough: 'Strikethrough',
  underline: 'Underline',
  textcolor: 'Color',
  textBackgroundColor: 'Background Color',
  justifyLeft: 'Align Left',
  justifyCenter: 'Align Center',
  justifyRight: 'Align Right',
  justifyFull: 'Align Justify',
  insertLink: 'Insert Link',
  insertPicture: 'Insert Picture',
  insertUnorderedList: 'Unordered List',
  insertOrderedList: 'Numbered List',
  indent: 'Increase Indent',
  outdent: 'Decrease Indent',
  insertHorizontalRule: 'Insert Horizontal Line',
  showHTML: 'Show HTML code',
  undo: 'Undo',
  redo: 'Redo',
  addLinkHead: 'Add Link',
  addImageHead: 'Add Image',
  linkUrlLabel: 'Enter a URL:',
  linkDescription: 'Enter a description',
  imageUrlLabel: 'Enter a URL:',
  okButton: 'OK',
  cancelButton: 'cancel',
  moreOptions: 'Show More Options',
};

export const TOOLBAR_STYLE_ITEMS = [
  { type: 'paragraph', selector: 'p' },
  { type: 'heading', selector: 'h1' },
  { type: 'heading', selector: 'h2' },
  { type: 'heading', selector: 'h3' },
  { type: 'heading', selector: 'h4' },
  { type: 'heading', selector: 'h5' },
  { type: 'heading', selector: 'h6' },
  { type: 'preformatted', selector: 'pre' },
];

export const TEXT_FORMATING_ITEMS = [
  { type: 'bold', icon: 'fas fa-bold' },
  { type: 'italic', icon: 'fas fa-italic' },
  { type: 'underline', icon: 'fas fa-underline' },
  { type: 'strikethrough', icon: 'fas fa-strikethrough' },
  //   { type: 'textcolor', icon: 'fas fa-font' },
  //   { type: 'textBackgroundColor', icon: 'fas fa-paint-brush' }
];

export const ALIGN_ITEMS = [
  { type: 'justifyLeft', icon: 'fas fa-align-left' },
  { type: 'justifyCenter', icon: 'fas fa-align-center' },
  { type: 'justifyRight', icon: 'fas fa-align-right' },
  { type: 'justifyFull', icon: 'fas fa-align-justify' },
];

export const LIST_ITEMS = [
  { type: 'insertUnorderedList', icon: 'fas fa-list-ul' },
  { type: 'insertOrderedList', icon: 'fas fa-list-ol' },
  { type: 'outdent', icon: 'fas fa-outdent' },
  { type: 'indent', icon: 'fas fa-indent' },
];

export const UNDO_REDO_ITEMS = [
  { type: 'undo', icon: 'fas fa-angle-left' },
  { type: 'redo', icon: 'fas fa-angle-right' },
];

export const TOOLBAR_OPTIONS: MdbWysiwygToolbarOptions = {
  styles: {
    disabled: false,
    hidden: false,
    p: { disabled: false, hidden: false },
    h1: { disabled: false, hidden: false },
    h2: { disabled: false, hidden: false },
    h3: { disabled: false, hidden: false },
    h4: { disabled: false, hidden: false },
    h5: { disabled: false, hidden: false },
    h6: { disabled: false, hidden: false },
    pre: { disabled: false, hidden: false },
  },
  formatting: {
    disabled: false,
    hidden: false,
    bold: { disabled: false, hidden: false },
    italic: { disabled: false, hidden: false },
    underline: { disabled: false, hidden: false },
    strikethrough: { disabled: false, hidden: false },
    textColor: { disabled: false, hidden: false },
    textBackground: { disabled: false, hidden: false },
  },
  align: {
    disabled: false,
    hidden: false,
    justifyLeft: { disabled: false, hidden: false },
    justifyCenter: { disabled: false, hidden: false },
    justifyRight: { disabled: false, hidden: false },
    justifyFull: { disabled: false, hidden: false },
  },
  lists: {
    disabled: false,
    hidden: false,
    insertUnorderedList: { disabled: false, hidden: false },
    insertOrderedList: { disabled: false, hidden: false },
    indent: { disabled: false, hidden: false },
    outdent: { disabled: false, hidden: false },
  },
  links: {
    disabled: false,
    hidden: false,
    link: { disabled: false, hidden: false },
    image: { disabled: false, hidden: false },
    insertHorizontalRule: { disabled: false, hidden: false },
  },
  showCode: { disabled: false, hidden: false },
  undoRedo: {
    disabled: false,
    hidden: false,
    undo: { disabled: false, hidden: false },
    redo: { disabled: false, hidden: false },
  },
};

export const COLORS_OPTIONS: string[] = [
  '#1266F1', // Primary
  '#B23CFD', // Secondary
  '#00B74A', // Success
  '#F93154', // Danger
  '#FFA900', // Warning
  '#39C0ED', // Info
  '#FBFBFB', // Light
  '#262626', // Dark
];
