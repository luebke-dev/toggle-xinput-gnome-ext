'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function buildPrefsWidget() {

    let gschema = Gio.SettingsSchemaSource.new_from_directory(
        Me.dir.get_child('schemas').get_path(),
        Gio.SettingsSchemaSource.get_default(),
        false
    );

    this.settings = new Gio.Settings({
        settings_schema: gschema.lookup('org.gnome.shell.extensions.togglexinput', true)
    });

    let prefsWidget = new Gtk.Grid({
        margin: 24,
        column_spacing: 24,
        row_spacing: 12,
        visible: true
    });

    let labelXInputId = new Gtk.Label({
        label: 'xinput id to toggle:',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(labelXInputId, 0, 0, 1, 1);

    let inputXInputId = new Gtk.SpinButton()
    inputXInputId.set_range(0, 100)
    inputXInputId.set_sensitive(true)
    inputXInputId.set_increments(1, 10)
    prefsWidget.attach(inputXInputId, 1, 0, 1, 1)
    inputXInputId.set_value(settings.get_int('xinput-id'))
    inputXInputId.connect('value-changed', widget => {
        settings.set_int('xinput-id-height', widget.get_value_as_int())
    })
    settings.connect('changed::xinput-id', () => {
        inputXInputId.set_value(settings.get_int('xinput-id'))
    })

    
    prefsWidget.show_all();
    return prefsWidget;
}