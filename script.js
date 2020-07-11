function initContent() {
    var urlParams = new URLSearchParams(window.location.search);
	
	var tabs = document.getElementById('tabs');
	var sections = document.getElementById('sections');
    var content = document.getElementById('content');

    fetch("./resources/data.json")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            // Get the url params.
            var thisTabId = urlParams.get('tab') ?? Object.keys(json)[0];
            var thisSectionId = urlParams.get('section') ?? Object.keys(json[thisTabId].sections)[0];
            
            // Populate the nav tabs.
            for (var tabId in json) {
                addNavLink(tabs, `?tab=${tabId}`, json[tabId].title);
            }

            // Populate the sections tabs.
            for (var sectionId in json[thisTabId].sections) {
                addNavLink(sections, `?tab=${thisTabId}&section=${sectionId}`, json[thisTabId].sections[sectionId].text);
            }

            // Populate the content recursively.
            addContentNode(content, json[thisTabId].sections[thisSectionId], 0);
        });
}

/**
 * 
 * @param {Node} parent
 * @param {JSON} json
 * @param {number} depth
 */
function addContentNode(parent, json, depth) {
    // Create the node
    
    if (!json.text) { // The node is terminal
        var text = document.createElement('p');
        text.setAttribute('class', 'node');
        text.innerText = json.toString();
        parent.appendChild(text);
    } else { // The node is non-terminal
        var node = document.createElement('section');
        node.setAttribute('class', 'node');
        parent.appendChild(node);

        var text = document.createElement(depth > 5 ? 'p' : `h${depth + 1}`);
        text.innerText = json.text;
        node.appendChild(text);

        for (var childIdx in json.children) {
            addContentNode(node, json.children[childIdx], depth + 1);
        }
    }
}

/**
 * 
 * @param {Node} parent
 * @param {string} link
 * @param {string} title
 */
function addNavLink(parent, link, title) {
    var li = document.createElement('li');
    parent.appendChild(li);

    var a = document.createElement('a');
    a.innerText = title;
    a.setAttribute('href', link);
    li.appendChild(a);
}