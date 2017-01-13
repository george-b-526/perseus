/**
 * Identifies whether or not a given perseus item requires the use of a mouse
 * or screen, based on the widgets it contains.
 */

const _ = require("underscore");

const {findLeafNodes} = require("./multirenderer.jsx");
const Traversal = require("./traversal.jsx");
const Widgets = require("./widgets.js");

// Iterate over a single Perseus renderer, mutating `widgets` by appending
// violating widget types discovered in this item.
function traverseRenderer(itemData, widgets) {
    Traversal.traverseRendererDeep(
        itemData,
        null,
        function(info) {
            if (info.type && !Widgets.isAccessible(info)) {
                widgets.push(info.type);
            }
        }
    );
}

module.exports = {
    // Returns a list of widgets that cause a given perseus item to require
    // the use of a screen or mouse.
    //
    // For now we'll just check the `accessible` field on each of the widgets
    // in the item data, but in the future we may specify accessibility on
    // each widget with higher granularity.
    violatingWidgets: function(itemData) {
        // TODO(jordan): Hints as well
        const widgets = [];

        if (itemData._multi) {
            findLeafNodes(itemData, (leaf, type) => {
                if (type === "item") {
                    traverseRenderer(leaf, widgets);
                }
            });
        } else {
            traverseRenderer(itemData.question, widgets);
        }

        // Uniquify the list of widgets (by type)
        return _.uniq(widgets);
    },
};
