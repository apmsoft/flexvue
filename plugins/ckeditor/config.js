/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		'/',
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Source,Save,Underline,Subscript,Superscript,Scayt,HiddenField,about';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	config.extraPlugins = 'widget,widgetselection,lineutils,codesnippet,prism';
	config.codeSnippet_theme = 'default';
	// config.codeSnippet_codeClass = 'hljs';
	// config.codeSnippet_languages = {
	// 	javascript: 'JavaScript',
	// 	php: 'PHP',
	// 	css: 'CSS',
	// 	html : 'HTML',
	// 	swift : 'Swift'
	// };

	// config.removeButtons = 'Source,Save,Templates,Cut,Undo,Find,SelectAll,Scayt,Form,CopyFormatting,Outdent,Blockquote,JustifyLeft,BidiLtr,Link,Image,Styles,TextColor,Maximize,About,Flash,BGColor,ShowBlocks,Format,Font,FontSize,Iframe,PageBreak,SpecialChar,Smiley,HorizontalRule,Table,Anchor,Unlink,BidiRtl,Language,JustifyBlock,JustifyRight,JustifyCenter,CreateDiv,Indent,RemoveFormat,Checkbox,Radio,TextField,Textarea,Select,ImageButton,HiddenField,Replace,Redo,Copy,Paste,PasteText,PasteFromWord,Print,Preview,NewPage,Button,Subscript,Superscript';

};
