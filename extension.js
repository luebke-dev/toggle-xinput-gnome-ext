/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */
const { GLib, Gio, St, Shell, Clutter, GObject, Soup } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Util = imports.misc.util;

let disabled = false;
let settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.togglexinput')

// Indicator
let XInputInicator = GObject.registerClass(
    { GTypeName: "XInputInicator" },
    class PlexIndicator extends PanelMenu.Button {
      _init() {
        super._init(0.0, `${Me.metadata.name} Indicator`, false);
  
        let icon = new St.Icon({
          style_class: "system-status-icon touch-tap-background-symbolic",
        });
  
        this.actor.add_child(icon);
        this.actor.connect("button-press-event", function (actor, event) {
          if (!disabled) {
            Util.spawnCommandLine("xinput disable " + settings.get_int('xinput-id'));
            disabled = true
          } else {
            Util.spawnCommandLine("xinput enable " + settings.get_int('xinput-id'))
            disabled = false
          }
        });
      }
    }
  );


class Extension {
    constructor() {
        this._indicator = null;
    }

    enable() {
        if (this._indicator === null) {
            this._indicator = new XInputInicator();
            Main.panel.addToStatusArea("XInputIndicator", this._indicator);
          }
    }

    disable() {
        if (this._indicator !== null) {
            this._indicator.destroy();
            this._indicator = null;
        }
        if (disabled) {
          disabled = false
          Util.spawnCommandLine("xinput enable " + settings.get_int('xinput-id'))
        }
    }
}

function init() {
    return new Extension();
}
