# Keep work and its context connected

In a tool with source and result panes, show the location or object a secondary pane refers to in both places: a debugger can mark the paused source line while the stack identifies the selected frame; a document inspector can identify the selected object while the canvas marks it. Avoid a detached pane that shows useful details but leaves their subject ambiguous. A subtle mark and a label are often enough; do not use color alone to indicate the active object.

At the minimum supported window size the secondary view may become a tab or temporary disclosure. Select a result, switch or collapse the pane, then return via keyboard: the source location, selection and next available action should still agree. Capture both panes while linked and the collapsed state. A showcase screenshot can demonstrate the arrangement, not the keyboard or restoration behavior.
