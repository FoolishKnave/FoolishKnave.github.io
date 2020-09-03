function initContent() {
    var urlParams = new URLSearchParams(window.location.search);
	
	var tabs = document.getElementById('tabs');
	var sections = document.getElementById('sections');
    var content = document.getElementById('content');

    // Get the url params.
    var thisTabId = urlParams.get('tab') ?? 'home';
    var thisSectionId = urlParams.get('section');

    fetch('./resources/tabs.json')
        .then(res => res.json())
        .then(function (json) {
            // Populate the nav tabs.
            for (var tabId in json) {
                addNavLink(tabs, `?tab=${json[tabId]}`, tabId);
            }
        });

    fetch(`./resources/data/${thisTabId}.json`)
        .then(res => res.json())
        .then(function (json) {
            thisSectionId = thisSectionId ?? Object.keys(json.sections)[0];
            // Poplulate the section tabs
            for (var sectionId in json.sections) {
                addNavLink(sections, `?tab=${thisTabId}&section=${sectionId}`, json.sections[sectionId].text);
            }

            addContentNode(content, json.sections[thisSectionId], 0);
        });
}

/**
 * 
 * @param {Node} parent
 * @param {JSON} json
 * @param {Number} depth
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
 * @param {String} link
 * @param {String} title
 */
function addNavLink(parent, link, title) {
    var li = document.createElement('li');
    parent.appendChild(li);

    var a = document.createElement('a');
    a.innerText = title;
    a.setAttribute('href', link);
    li.appendChild(a);
}