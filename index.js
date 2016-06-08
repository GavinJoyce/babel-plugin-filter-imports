module.exports = function(babel) {
  // A stack of booleans that determine whether an expression statement
  // should be removed as it is exited. Expression statements are removed
  // when they contain a reference to a filtered imported.
  var shouldRemove;

  return {
    visitor: {
      Program: {
        enter: function() {
          shouldRemove = [];
        },
        exit: function() {
          shouldRemove = undefined;
        }
      },

      ExpressionStatement: {
        enter: function() {
          if (shouldRemove) {
            shouldRemove.push(false);
          }
        },
        exit: function(path) {
          if (shouldRemove && shouldRemove.pop()) {
            path.remove();
          }
        }
      },

      Identifier: function(path, state) {
        // Ensure that we're inside of an expression statement.
        if (shouldRemove && shouldRemove.length > 0) {
          if (referencesFilteredImport(path, state.opts)) {
            shouldRemove[shouldRemove.length - 1] = true;
          }
        }
      }
    }
  };
};

function referencesFilteredImport(identifier, filteredImports) {
  for (var moduleName in filteredImports) {
    var imports = filteredImports[moduleName];
    for (var i = 0; i < imports.length; i++) {
      if (identifier.referencesImport(moduleName, imports[i])) {
        return true;
      }
    }
  }

  return false;
}
