import editorJS from '../../../editor-js/dist/editor';
import { EditorConfig } from '@editorjs/editorjs';

export class PatchedEditor extends editorJS {

    onReady = () => { };

    constructor(configuration?: EditorConfig) {
      super(configuration);
    }

    public exportAPI(editor: any) {
      super['exportAPI'](editor);
      const Paste = editor.moduleInstances.Paste;
      const onPastes = Paste.Editor.Listeners.findAll(document, 'paste');
      Paste.Editor.Listeners.allListeners = (Paste.Editor.Listeners.allListeners as []).filter(l => !onPastes.includes(l));
      onPastes.forEach(paste => paste.element.removeEventListener(paste.eventType, paste.handler, paste.options));
      Paste.Editor.Listeners.on(Paste.Editor.UI.nodes.holder, 'paste', Paste.handlePasteEvent);
    }
  }